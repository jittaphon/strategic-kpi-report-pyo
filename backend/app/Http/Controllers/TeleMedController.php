<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Carbon\Carbon; // จำเป็นสำหรับการจัดการวันที่

class TeleMedController extends BaseController
{
    /**
     * API ดึงข้อมูลทั้งหมดจากตาราง tele_med
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTeleMedData()
    {
        try {
            $sql = "SELECT * FROM tele_med";
            $results = DB::select($sql);

            return response()->json([
                'status' => 'Database connection successful',
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Database connection failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * API สำหรับบันทึกหรืออัปเดตข้อมูล TeleMed
     * รับข้อมูลเป็น Array ของ Objects จาก Frontend
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeTeleMedData(Request $request)
    {
        // ตรวจสอบว่าข้อมูลที่ส่งมาเป็น JSON และเป็น Array ของ Objects
        if (!$request->isJson() || !is_array($request->json()->all())) {
            return response()->json([
                'error' => 'Invalid JSON data provided. Expected an array of objects in the request body.',
                'received_data' => $request->json()->all(),
            ], 400);
        }

        $dataToProcess = $request->json()->all();
        $processedRecords = [];
        $currentQueryDate = Carbon::now()->toDateString(); // กำหนด query_date เป็นวันที่ปัจจุบันที่ข้อมูลถูกส่งมา

        // เริ่มต้น Database Transaction เพื่อให้มั่นใจว่าข้อมูลทั้งหมดถูกบันทึก/อัปเดตอย่างถูกต้อง หรือไม่มีการบันทึกเลยหากเกิดข้อผิดพลาด
        DB::beginTransaction();
        try {
            foreach ($dataToProcess as $record) {
                // ตรวจสอบว่ามีคีย์ 'HOSPCODE_HOSNAME' อยู่ในข้อมูลหรือไม่
                if (!isset($record['HOSPCODE_HOSNAME'])) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Missing "HOSPCODE_HOSNAME" in one of the records. Each record must have this key.',
                        'record_failed' => $record
                    ], 400);
                }

                // แยก HOSPCODE และ hosname ออกจากสตริง "HOSPCODE_HOSNAME"
                // เช่น "11187 โรงพยาบาลปง" -> HOSPCODE: "11187", hosname: "โรงพยาบาลปง"
                preg_match('/^(\d+)\s(.+)$/', $record['HOSPCODE_HOSNAME'], $matches);

                $hospcode = null;
                $hosname = null;

                if (count($matches) === 3) {
                    $hospcode = $matches[1];
                    $hosname = $matches[2];
                } else {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Could not parse HOSPCODE and hosname from: ' . $record['HOSPCODE_HOSNAME'] . '. Expected format "NUMBER NAME".',
                        'record_failed' => $record
                    ], 400);
                }

                // เตรียมข้อมูลสำหรับ Insert/Update
                // กำหนดค่าเริ่มต้นสำหรับเดือนที่ไม่พบใน JSON เป็น 0 หรือ null ตามความเหมาะสมของ DB schema ของคุณ
                $data = [
                    'HOSPCODE' => $hospcode,
                    'hosname' => $hosname,
                    'Total' => $record['Total'] ?? 0,
                    'total_october' => $record['total_october'] ?? 0,
                    'total_november' => $record['total_november'] ?? 0,
                    'total_december' => $record['total_december'] ?? 0,
                    'total_january' => $record['total_january'] ?? 0,
                    'total_february' => $record['total_february'] ?? 0,
                    'total_march' => $record['total_march'] ?? 0,
                    'total_april' => $record['total_april'] ?? 0,
                    'total_may' => $record['total_may'] ?? 0,
                    'total_june' => $record['total_june'] ?? 0,
                    'total_july' => $record['total_july'] ?? 0,
                    'total_august' => $record['total_august'] ?? 0,
                    'total_september' => $record['total_september'] ?? 0,
                    'query_date' => $currentQueryDate, // กำหนดวันที่คิวรี่เป็นวันที่ปัจจุบันที่ข้อมูลถูกนำเข้า
                ];

                // ตรวจสอบว่ามี record ที่มี HOSPCODE นี้อยู่แล้วหรือไม่
                $existingRecord = DB::table('tele_med')
                    ->where('HOSPCODE', $hospcode)
                    ->first();

                if ($existingRecord) {
                    // ถ้ามี record อยู่แล้ว ให้อัปเดตข้อมูล
                    DB::table('tele_med')
                        ->where('HOSPCODE', $hospcode)
                        ->update($data); // $data มีข้อมูลทั้งหมดรวมถึง query_date ล่าสุด
                    $action = 'updated';
                } else {
                    // ถ้ายังไม่มี record ให้อินเสิร์ตข้อมูลใหม่
                    DB::table('tele_med')->insert($data);
                    $action = 'inserted';
                }
                $processedRecords[] = ['HOSPCODE' => $hospcode, 'query_date' => $currentQueryDate, 'action' => $action];
            }

            DB::commit(); // ยืนยัน Transaction: บันทึกการเปลี่ยนแปลงทั้งหมด
            return response()->json([
                'status' => 'Data processed successfully',
                'processed_count' => count($processedRecords),
                'details' => $processedRecords
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // ยกเลิก Transaction: หากมีข้อผิดพลาด ข้อมูลจะไม่ถูกบันทึก/อัปเดตเลย
            return response()->json([
                'error' => 'Failed to process data: ' . $e->getMessage(),
                'line' => $e->getLine(), // สำหรับ Debugging
                'trace' => $e->getTraceAsString() // สำหรับ Debugging
            ], 500);
        }
    }

     public function getTeleMedV2(Request $request)
{
    try {
        $budgetYear = $request->input('budget_year', date('Y'));

        // ถ้าผู้ใช้ส่ง พ.ศ. เช่น 2568 → 2025
        if ($budgetYear > 2500) {
            $budgetYear -= 543;
        }

        // ช่วงต.ค.ปีที่แล้ว → ก.ย.ปีนี้
        // เช่น ปีงบ 2025 → 2024-10 ถึง 2025-09
        $start = Carbon::create($budgetYear - 1, 10, 1);
        $end   = Carbon::create($budgetYear, 9, 1);

        // แปลง yyyyMM สำหรับเทียบใน SQL
        $startYm = (int)$start->format('Ym');
        $endYm   = (int)$end->format('Ym');

        $sql = "
            SELECT
                HOSPCODE,
                HOSNAME,
                year,
                month,
                cnt,
                CONCAT(year, '-', LPAD(month, 2, '0')) AS yymm
            FROM tele_med_new
            WHERE (year * 100 + month) BETWEEN :startYm AND :endYm
            ORDER BY HOSPCODE, year, month
        ";

        $results = DB::select($sql, [
            'startYm' => $startYm,
            'endYm'   => $endYm
        ]);

        return response()->json([
            'status'        => 'OK',
            'budget_year'   => $budgetYear,
            'period_start'  => $start->format('Y-m'),
            'period_end'    => $end->format('Y-m'),
            'data'          => $results
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
     }     


     
}
