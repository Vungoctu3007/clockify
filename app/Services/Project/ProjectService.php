<?php
namespace App\Services\Project;

use App\Repositories\Project\ProjectRepository;
use App\Services\BaseService;


class ProjectService extends BaseService {
    protected $repository;

    public function __construct(ProjectRepository $repository) {
        $this->repository = $repository;
    }

    public function getUserProjects($userId)
    {
        return $this->repository->getProjectsByUserId($userId);
    }

    public function getAssignedProjects($assigneeId)
    {
        return $this->repository->getProjectsByAssigneeId($assigneeId);
    }

    public function getAllRelatedProjects($userId)
    {
        return $this->repository->getCombinedProjects($userId);
    }
}
