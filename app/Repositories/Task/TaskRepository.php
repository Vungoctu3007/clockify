<?php
namespace App\Repositories\Task;

use App\Repositories\BaseRepository;
use App\Models\Task;

class TaskRepository extends BaseRepository {
    protected $model;

    public function __construct(Task $model) {
        parent::__construct($model);
    }

    public function paginate($params =[], $query = null) {
        $query = $this->model->newQuery();

        if(!empty($params['user_id'])) {

        }
    }

    public function getAllTaskByProjectId(int $projectId) {
        return $this->model->where('project_id', $projectId)->get();
    }
}
