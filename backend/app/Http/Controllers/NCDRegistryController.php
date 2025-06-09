<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class NCDRegistryController extends BaseController
{

    public function postDataNCDRegistry(Request $request)
    {
        // รับข้อมูลจาก POST
        $hospitalId = $request->input('hospital_id');
        $cases = $request->input('cases');
        $clientIp = $request->ip();
        $userAgent = $request->header('User-Agent');

        $now = date('Y-m-d H:i:s');
        $reportId = DB::table('tb_hospital_reports')->insertGetId([
            'hospital_id'     => $hospitalId,
            'total_patients'  => $totalPatients = array_sum(array_column($cases, 'case_count')),
            'created_at'      => $now,
        ]);

        foreach ($cases as $case) {
            DB::table('tb_disease_cases')->insert([
                'hospital_report_id' => $reportId, // ใช้ ID ที่ได้จาก insert ด้านบน
                'disease_id'         => $case['disease_id'],
                'case_count'         => $case['case_count'],
                'created_at'         => $now,
                'client_ip'          => $clientIp,
                'user_agent'         => $userAgent,
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    // API ดึงข้อมูลทั้งหมด
    public function getNCDRegistry()
    {
        try {
            $sql = "-- STEP 1: รวมยอดคนไข้ทั้งหมดของแต่ละโรงพยาบาล จากทุก report
WITH total_patients_per_hospital AS (
    SELECT hospital_id, SUM(total_patients) AS total_patients
    FROM tb_hospital_reports
    GROUP BY hospital_id
),

-- STEP 2: รวมยอดโรคจากทุก report
disease_sums AS (
    SELECT 
        r.hospital_id,
        SUM(CASE WHEN dc.disease_id = 1 THEN dc.case_count ELSE 0 END) AS เบาหวาน,
        SUM(CASE WHEN dc.disease_id = 2 THEN dc.case_count ELSE 0 END) AS ความดันโลหิตสูง,
        SUM(CASE WHEN dc.disease_id = 3 THEN dc.case_count ELSE 0 END) AS โรคหลอดเลือดสมอง,
        SUM(CASE WHEN dc.disease_id = 4 THEN dc.case_count ELSE 0 END) AS โรคหัวใจขาดเลือด,
        SUM(CASE WHEN dc.disease_id = 5 THEN dc.case_count ELSE 0 END) AS โรคปอดอุดกั้นเรื้อรัง,
        SUM(CASE WHEN dc.disease_id = 6 THEN dc.case_count ELSE 0 END) AS ไขมันในเลือดสูง,
        SUM(CASE WHEN dc.disease_id = 7 THEN dc.case_count ELSE 0 END) AS โรคอ้วนลงพุง
    FROM tb_disease_cases dc
    JOIN tb_hospital_reports r ON r.id = dc.hospital_report_id
    GROUP BY r.hospital_id
)

-- STEP 3: JOIN กับชื่อโรงพยาบาล แล้วรวมทั้งหมด
SELECT 
    h.hos_name AS ชื่อโรงพยาบาล,
    tp.total_patients AS จำนวนผู้ป่วยทั้งหมด,
    ds.เบาหวาน,
    ds.ความดันโลหิตสูง,
    ds.โรคหลอดเลือดสมอง,
    ds.โรคหัวใจขาดเลือด,
    ds.โรคปอดอุดกั้นเรื้อรัง,
    ds.ไขมันในเลือดสูง,
    ds.โรคอ้วนลงพุง
FROM total_patients_per_hospital tp
JOIN disease_sums ds ON ds.hospital_id = tp.hospital_id
JOIN tb_hos h ON h.hos_id = tp.hospital_id
ORDER BY h.hos_name;
";

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
}
