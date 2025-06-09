<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class TeleMedController extends BaseController
{
    // API ดึงข้อมูลทั้งหมด
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
}
