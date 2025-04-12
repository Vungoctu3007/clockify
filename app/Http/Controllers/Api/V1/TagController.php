<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Repositories\Tag\TagRepository;
use App\Services\Tag\TagService;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class TagController extends Controller
{
    protected $tagRepository;
    protected $tagService;
    public function __construct(TagRepository $tagRepository, TagService $tagService)
    {
        $this->tagRepository = $tagRepository;
        $this->tagService = $tagService;
    }

    public function index(Request $request)
    {
        $user_id = auth()->id();

        if (empty($user_id)) {
            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        $tags = $this->tagService->paginate($request, $user_id);

        return response()->json([
            'success' => true,
            'data' => $tags
        ], 200);
    }

    public function create(Request $request)
    {
        try {
            $user_id = auth()->id();

            if (empty($user_id)) {
                return response()->json([
                    'error' => 'Unauthenticated'
                ], 401);
            }

            $tags = $this->tagService->create($request, $user_id);

            return response()->json([
                'message' => 'Tag created successfully',
                'data' => $tags,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to created',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function update(Request $request, $tagId) {
        try {
            $tags = $this->tagService->update($request, $tagId);

            return response()->json([
                'success' => true,
                'data' => $tags,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($tagId) {
        try {
            $tags = $this->tagRepository->delete($tagId);

            return response()->json([
                'success' => true,
                'data' => $tags,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
