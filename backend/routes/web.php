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


// routes/web.php หรือ routes/api.php ใน Lumen
$router->group(['prefix' => 'api'], function () use ($router) {
    $router->get('/tele_med', 'TeleMedController@getTeleMedData');
    $router->get('/ncd_registry', 'NCDRegistryController@getNCDRegistry');
    $router->post('/post_data_ncd_registry', 'NCDRegistryController@postDataNCDRegistry');
    $router->post('/post_data_tele_med', 'TeleMedController@storeTeleMedData');
    $router->post('/hdc_check/insert_data', 'HDCCheckController@InsertData');
    $router->get('/hdc_check/get_data', 'HDCCheckController@GetData');
});
