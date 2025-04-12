<?php
namespace App\Services\Task;

use App\Repositories\Task\TaskRepository;
use App\Services\BaseService;
use Illuminate\Http\Request;

class TaskService extends BaseService {
    protected $taskRepository;
    public function __construct(TaskRepository $taskRepository) {
        $this->taskRepository = $taskRepository;
    }

}
