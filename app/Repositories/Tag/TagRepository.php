<?php
namespace App\Repositories\Tag;

use App\Repositories\BaseRepository;
use App\Models\Tag;
class TagRepository extends BaseRepository
{
    protected $model;

    public function __construct(Tag $model)
    {
        parent::__construct($model);
    }

    public function paginate($params = [], $query = null)
    {
        $query = $this->model->newQuery();

        if (!empty($params['user_id'])) {
            $query->where('creator_id', $params['user_id']);
        }

        return parent::paginate($params, $query);
    }
}
