<?php
namespace App\Services\Task;

use App\Repositories\Task\TaskRepository;
use App\Services\BaseService;


class TaskService extends BaseService {
    protected $repository;

    public function __construct(TaskRepository $repository) {
        $this->repository = $repository;
    }

    
}
