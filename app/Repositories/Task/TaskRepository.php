<?php
namespace App\Repositories\Task;

use App\Repositories\BaseRepository;
use App\Models\Task;

class TaskRepository extends BaseRepository {
    protected $model;

    public function __construct(Task $model) {
        $this->model = $model;
    }
}
