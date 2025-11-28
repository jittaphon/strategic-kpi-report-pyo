<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Carbon\Carbon; // จำเป็นสำหรับการจัดการวันที่

class HDCCheckController extends BaseController
{
    /**
     * API ดึงข้อมูลทั้งหมดจากตาราง tele_med
     * @return \Illuminate\Http\JsonResponse
     */




    public function InsertData(Request $request)
    {
        try {
            $allData = $request->all(); // จะได้ array ของ objects

            foreach ($allData as $data) {
                if (isset($data['name']) && strpos($data['name'], ':') !== false) {
                    list($hosp_code, $hosp_name) = explode(':', $data['name'], 2);
                } else {
                    $hosp_code = null;
                    $hosp_name = $data['name'] ?? null;
                }

                DB::table('tb_hdc_send_summary')->updateOrInsert(
                    [
                        'hosp_code' => $hosp_code,
                        'yymm' => $data['yymm']
                    ],
                    [
                        'hosp_name' => $hosp_name,
                        'total' => $data['total'] ?? 0,
                    ]
                );
            }


            return response()->json([
                'status' => 'Data inserted successfully',
                'count' => count($allData)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Database insert failed: ' . $e->getMessage()
            ], 500);
        }
    }
public function GetData(Request $request)
{
    try {
        $budgetYear = $request->input('budget_year', date('Y'));

        // ถ้าส่งเป็น พ.ศ. → แปลงเป็น ค.ศ.
        if ($budgetYear > 2500) {
            $budgetYear -= 543;
        }

        // คำนวณปีเริ่มต้นของงบประมาณ (ต.ค. ของปีก่อน)
        // ปีงบ 2025 = ต.ค. 2024 ถึง ก.ย. 2025
        $startDate = Carbon::create($budgetYear - 1, 10, 1); // เริ่มที่ ต.ค. ของปีก่อน

        // สร้างช่วงเดือนครบ 12 เดือน
        $months = [];
        for ($i = 0; $i < 12; $i++) {
            $currentDate = $startDate->copy()->addMonths($i);
            $yymm = $currentDate->format('Y-m');
            $alias = $currentDate->format('M_y'); // เช่น Oct_24, Nov_24

            $months[] = "MAX(CASE WHEN yymm='$yymm' THEN total ELSE 0 END) AS `$alias`";
        }

        $monthColumns = implode(",\n       ", $months);

        $sql = "
        SELECT hosp_code, hosp_name,
               $monthColumns
        FROM tb_hdc_send_summary
        GROUP BY hosp_code, hosp_name
        ORDER BY hosp_code
        ";

        $results = DB::select($sql);

        return response()->json([
            'status' => 'Database connection successful',
            'budget_year' => $budgetYear,
            'start_period' => $startDate->format('Y-m'),
            'end_period' => $startDate->copy()->addMonths(11)->format('Y-m'),
            'data' => $results
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Database connection failed: ' . $e->getMessage()
        ], 500);
    }
}

}
