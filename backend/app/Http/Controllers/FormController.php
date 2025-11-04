<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Laravel\Lumen\Routing\Controller as BaseController;

class FormController extends BaseController
{
    public function InsertForms(Request $request)
    {
        try {
            $table = 'tb_surveyresponses';
            $data = $request->all();
            $columns = DB::getSchemaBuilder()->getColumnListing($table);
            $filtered = array_intersect_key($data, array_flip($columns));

            $now = Carbon::now();
            if (in_array('created_at', $columns)) $filtered['created_at'] = $now;
            if (in_array('updated_at', $columns)) $filtered['updated_at'] = $now;

            // ✅ ถ้าไม่มีข้อมูลในตาราง ให้ reset id = 1
            $count = DB::table($table)->count();
            if ($count === 0) {
                DB::statement("ALTER TABLE {$table} AUTO_INCREMENT = 1");
            }

            DB::table($table)->insert($filtered);

            return response()->json([
                'status' => 'success',
                'message' => 'Form inserted successfully',
                'data' => $filtered
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Insert failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
