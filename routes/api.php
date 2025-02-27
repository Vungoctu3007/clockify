<?php

use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::group([

    'middleware' => ['api', 'jwt'],
    'prefix' => 'v1/auth'

], function ($router) {

    Route::post('login', [AuthController::class, 'login']);
    Route::get('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me'])->middleware('jwt');

    Route::post('/tasks', [TaskController::class, 'create']);
});


Route::group([

    'middleware' => 'api',
    'prefix' => 'v1'

], function ($router) {
    Route::get('tasks/index', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'create']);
});
