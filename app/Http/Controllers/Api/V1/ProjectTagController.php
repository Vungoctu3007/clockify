<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectTagResource;
use App\Http\Resources\TagResource;
use App\Services\ProjectTag\ProjectTagService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectTagController extends Controller
{
    protected $projectTagService;
    public function __construct(ProjectTagService $projectTagService) {
        $this->projectTagService = $projectTagService;
    }

    public function getAllTagByProjectId(Request $request) {
        $tags = $this->projectTagService->getAllTagsByProjectId($request);
        return response()->json([
            'data' => TagResource::collection($tags)
        ], Response::HTTP_OK);
    }
}
