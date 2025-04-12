<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Repositories\Task\TaskRepository;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Task\TaskService;

class TaskController extends Controller
{
    protected $taskRepository;
    protected $taskService;
    public function __construct(TaskRepository $taskRepository, TaskService $taskService)
    {
        $this->taskRepository = $taskRepository;
        $this->taskService = $taskService;
    }

    public function getAllTaskByProjectId(Request $request)
    {
        $projectId = $request->get('project_id');

        $tasks = $this->taskRepository->getAllTaskByProjectId($projectId);

        return response()->json([
            'success' => true,
            'data' => TaskResource::collection($tasks)
        ], Response::HTTP_OK);
    }

    public function create(Request $request)
    {
        $payload = [
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'project_id' => $request->get('project_id'),
            'assignee_id' => $request->get('user_id')
        ];

        $task = $this->taskRepository->create($payload);

        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task,
        ], Response::HTTP_OK);
    }

    public function update(Request $request, $taskId)
    {
        try {
            $payload = [
                'title' => $request->get('title'),
                'description' => $request->get('description'),
            ];

            $task = $this->taskRepository->update($taskId, $payload);

            return response()->json([
                'message' => 'Task updated successfully',
                'data' => $task,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($taskId)
    {
        try {
            $this->taskRepository->delete($taskId);
            return response()->json([
                'message' => 'Task deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
