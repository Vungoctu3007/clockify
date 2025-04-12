<?php
use App\Http\Controllers\Api\V1\CustomBroadcastingAuth;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ProjectTagController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\TimeEntryController;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::group([

    'middleware' => 'api',
    'prefix' => 'v1/auth'

], function ($router) {

    Route::post('login', [AuthController::class, 'login']);
    Route::get('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me'])->middleware('jwt');
});


Route::group([

    'middleware' => ['api', 'jwt'],
    'prefix' => 'v1'

], function ($router) {
    Route::get('projects/index', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'create']);

    Route::get('/time-entries', [TimeEntryController::class, 'showCalendar']);
    Route::post('/time-entries/create-new-time-entry', [TimeEntryController::class, 'create']);
    Route::put('/time-entries/{id}', [TimeEntryController::class, 'update']);
    Route::delete('/time-entries/{id}', [TimeEntryController::class, 'delete']);

    Route::get('projects/get-all-projects-and-tasks', [ProjectController::class, 'getAllProjectsByUserId']);
    Route::get('project-tag/get-all-tags-by-projectId', [ProjectTagController::class, 'getAllTagByProjectId']);

    Route::get('tasks/index', [TaskController::class, 'getAllTaskByProjectId']);
    Route::post('tasks/create', [TaskController::class, 'create']);
    Route::put('/tasks/{taskId}', [TaskController::class, 'update']);
    Route::delete('/tasks/{taskId}', [TaskController::class, 'destroy']);

    Route::get('tags/index', [TagController::class, 'index']);
    Route::post('tags/create', [TagController::class, 'create']);
    Route::put('tags/update/{tagId}', [TagController::class, 'update']);
    Route::delete('/tags/{taskId}', [TagController::class, 'destroy']);

    Route::get('/notifications', function (Request $request) {
        $userId = $request->query('user_id');
        $notifications = \App\Models\Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                $createdAt = Carbon::parse($notification->created_at);
                return [
                    'title' => "Nhiệm vụ sắp bắt đầu",
                    'content' => $notification->message,
                    'time' => $createdAt->diffForHumans(),
                    'isRead' => (bool) $notification->is_read,
                ];
            });

        return response()->json($notifications);
    });
});

