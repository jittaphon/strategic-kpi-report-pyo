<?php

/** @var \Laravel\Lumen\Routing\Router $router */
$router->options('/{any:.*}', function () {
    $response = response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // ตั้งค่า Cache-Control ให้ไม่เก็บข้อมูลใน Cache
    $response->headers->set('Cache-Control', 'no-store');

    return $response;
});


$router->group([
    'prefix' => 'api',
    'middleware' => 'throttle:60,1' // จำกัด 60 ครั้งต่อ 1 นาที ต่อ IP หรือ user
], function () use ($router) {
    $router->get('/tele_med', 'TeleMedController@getTeleMedData');
    $router->get('/tele_med_v2', 'TeleMedController@getTeleMedV2');

    $router->get('/ncd_registry', 'NCDRegistryController@getNCDRegistry');
    $router->post('/post_data_ncd_registry', 'NCDRegistryController@postDataNCDRegistry');
    $router->post('/post_data_tele_med', 'TeleMedController@storeTeleMedData');
    
    $router->post('/hdc_check/insert_data', 'HDCCheckController@InsertData');
    $router->get('/hdc_check/get_data', 'HDCCheckController@GetData');

    $router->get('/utils/hcode_full_list', 'UtilsController@getHcodeListFull');
    $router->get('/utils/type_hos_list', 'UtilsController@getListAffiliation');
    $router->post('/forms/insert', 'FormController@InsertForms');
});
