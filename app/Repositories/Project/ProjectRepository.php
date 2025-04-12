<?php
namespace App\Repositories\Project;

use App\Repositories\BaseRepository;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository extends BaseRepository
{
    protected $model;

    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function paginate($params = [], $query = null)
    {
        $query = $this->model->newQuery();
        if (!empty($params['user_id'])) {
            $query->where(function ($query) use ($params) {
                $query->where('creator_id', $params['user_id'])
                    ->orWhereExists(function ($subQuery) use ($params) {
                        $subQuery->select(\DB::raw(1))
                            ->from('tasks')
                            ->whereColumn('tasks.project_id', 'projects.project_id')
                            ->where('tasks.assignee_id', $params['user_id']);
                    });
            });
        }

        $query->distinct();

        return parent::paginate($params, $query);
    }

    public function getProjectsByUserId($userId)
    {
        return $this->model->where('user_id', $userId)
            ->with('tasks')
            ->get();
    }

    public function getProjectsByAssigneeId($assigneeId)
    {
        return $this->model->whereHas('tasks', function ($query) use ($assigneeId) {
            $query->where('assignee_id', $assigneeId);
        })->with('tasks')->get();
    }

    public function getCombinedProjects($userId)
    {
        return $this->model->where(function ($query) use ($userId) {
            $query->where('creator_id', $userId) // Dự án do user tạo
                ->orWhereHas('tasks', function ($q) use ($userId) {
                    $q->where('assignee_id', $userId); // Chỉ lấy dự án có task với assignee_id = userId
                });
        })->with([
                    'tasks' => function ($query) use ($userId) {
                        $query->where('assignee_id', $userId); // Chỉ tải tasks với assignee_id = userId
                    }
                ])->distinct()->get();
    }
}
