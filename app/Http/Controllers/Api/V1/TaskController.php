<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Repositories\Task\TaskRepository;
use App\Services\Task\TaskService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller{
    protected $taskRepository;
    protected $taskService;

    public function __construct(TaskRepository $taskRepository, TaskService $taskService) {
        $this->taskRepository = $taskRepository;
        $this->taskService = $taskService;
    }

    public function index(Request $request) {
        $perPage = $request->query('perPage', 10);

        $tasks = $this->taskService->paginate($perPage);
        return TaskResource::collection($tasks);
    }

    public function create(Request $request): JsonResponse
    {
        $payload = [
            'name' => $request->input('name'),
            'color' => $request->input('color')
        ];

        $task = $this->taskRepository->create($payload);

        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task,
        ], Response::HTTP_OK);
    }


}
