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
            // รับปีงบจาก request (เช่น 2025) ถ้าไม่ส่งมาให้ใช้ปีปัจจุบัน
            $budgetYear = $request->input('budget_year', date('Y'));

            $startYear = $budgetYear - 1;
            $startMonth = 10; // ต.ค. คือเดือนเริ่มต้นของปีงบประมาณ

            // สร้างช่วงเดือน 12 เดือน
            $months = [];
            for ($i = 0; $i < 12; $i++) {
                $year = $startYear + floor(($startMonth + $i - 1) / 12);
                $month = str_pad((($startMonth + $i - 1) % 12) + 1, 2, '0', STR_PAD_LEFT);
                $yymm = "$year-$month";

                // alias เช่น Oct_24, Jan_25
                $alias = date("M_y", strtotime("$yymm-01"));

                $months[] = "MAX(CASE WHEN yymm='$yymm' THEN total ELSE 0 END) AS `$alias`";
            }

            $monthColumns = implode(",\n       ", $months);

            // ประกอบ SQL สุดท้าย
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
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Database connection failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
