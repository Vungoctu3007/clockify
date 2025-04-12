<?php
namespace App\Services\ProjectTag;

use App\Repositories\ProjectTag\ProjectTagRepository;
use App\Services\BaseService;
use Illuminate\Http\Request;

class ProjectTagService extends BaseService {
    protected $projectTagRepository;
    public function __construct(ProjectTagRepository $projectTagRepository) {
        $this->projectTagRepository = $projectTagRepository;
    }

    public function getAllTagsByProjectId(Request $request) {
        $projectId = $request->get('projectId');
        $tags = $this->projectTagRepository->getAllTagsByProjectId($projectId);
        return $tags;
    }

}
