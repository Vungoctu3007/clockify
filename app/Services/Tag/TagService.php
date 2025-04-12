<?php
namespace App\Services\Tag;

use App\Repositories\Tag\TagRepository;
use App\Services\BaseService;
use Illuminate\Http\Request;

class TagService extends BaseService {
    protected $tagRepository;
    public function __construct(TagRepository $tagRepository) {
        $this->tagRepository = $tagRepository;
        parent::__construct($tagRepository);
    }

    public function create(Request $request, $user_id) {
        $payload = [
            'creator_id' => $user_id,
            'name' => $request->get('name'),
        ];

        $data = $this->tagRepository->create($payload);

        return $data;
    }

    public function update(Request $request, $tagId) {
        $payload = [
            'name' => $request->get('name'),
        ];

        $data = $this->tagRepository->update($tagId, $payload);

        return $data;
    }

}
