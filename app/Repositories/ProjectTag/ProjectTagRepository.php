<?php
namespace App\Repositories\ProjectTag;

use App\Repositories\BaseRepository;
use App\Models\ProjectTag;
class ProjectTagRepository extends BaseRepository
{
    protected $model;

    public function __construct(ProjectTag $model)
    {
        parent::__construct($model);
    }

    public function getAllTagsByProjectId($projectId) {
        return $this->model
            ->where('project_tags.project_id', $projectId)
            ->join('tags', 'project_tags.tag_id', '=', 'tags.tag_id')
            ->select('tags.tag_id', 'tags.name')
            ->get();
    }
}
