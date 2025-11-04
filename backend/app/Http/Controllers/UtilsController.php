<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Carbon\Carbon; // จำเป็นสำหรับการจัดการวันที่

class UtilsController extends BaseController
{
    public function getHcodeListFull()
    {
        try {
            $priorityHospitals = [10717, 10718, 11184, 11185, 11186, 11187, 11188, 40744, 40745];

            $hcodeFullList = DB::table('Hcode')
                ->select(
                    'Hcode',
                    DB::raw("CONCAT(Hcode, ' ', name_Hcode) AS HmainOP_FULL")
                )
                ->orderByRaw(
                    'CASE WHEN Hcode IN (' . implode(',', $priorityHospitals) . ') THEN 0 ELSE 1 END'
                )
                ->orderBy('HmainOP_FULL')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $hcodeFullList,
                'message' => 'Successfully retrieved Hcode full list.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'status' => 'error',
                'message' => 'Failed to retrieve Hcode full list: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getListAffiliation()
    {
        try {
            $typeHosList = DB::table('Hcode')
                ->select('type_hos')
                ->whereNotNull('type_hos') // ป้องกันไม่ให้เอาค่า NULL มาแสดงใน filter
                ->distinct()
                ->orderBy('type_hos')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $typeHosList,
                'message' => 'Successfully retrieved type_hos list.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve type_hos list: ' . $e->getMessage()
            ], 500);
        }
    }
}
