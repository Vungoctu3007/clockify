<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TagResource;
use App\Models\Project;
use App\Repositories\Project\ProjectRepository;
use App\Repositories\ProjectTag\ProjectTagRepository;
use App\Repositories\Tag\TagRepository;
use App\Services\Project\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;


class ProjectController extends Controller{
    protected $projectRepository;
    protected $projectService;
    protected $tagRepository;

    public function __construct(ProjectRepository $projectRepository, ProjectService $projectService, TagRepository $tagRepository) {
        $this->projectRepository = $projectRepository;
        $this->projectService = $projectService;
        $this->tagRepository = $tagRepository;
    }

    public function index(Request $request) {
        $user_id = auth()->id();

        if (empty($user_id)) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $projects = $this->projectService->paginate($request, $user_id);
        $types = Project::getTypes();
        $accesses = Project::getAccesses();

        return response()->json([
            'projects' => $projects,
            'types' => $types,
            'accesses' => $accesses
        ], Response::HTTP_OK);
    }

    public function create(Request $request): JsonResponse
    {
        $userId = auth()->id();

        if (empty($userId)) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $payload = [
            'name' => $request->input('name'),
            'color' => $request->input('color'),
            'creator_id' => $userId
        ];

        $project = $this->projectRepository->create($payload);

        return response()->json([
            'message' => 'Project created successfully',
            'data' => $project,
        ], Response::HTTP_OK);
    }

    public function getAllProjectsByUserId(Request $request) {
        $userId = auth()->id();

        if(empty($userId)) {
            return response()->json(['error' => 'Unauthenticated'], response::HTTP_UNAUTHORIZED);
        }

        $projects = $this->projectService->getAllRelatedProjects($userId);
        return response()->json([
            'data' => ProjectResource::collection($projects),
        ], Response::HTTP_OK);
    }

}
