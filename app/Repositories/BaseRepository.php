<?php
namespace App\Repositories;
use Illuminate\Database\Eloquent\Model;

class BaseRepository {
    protected $model;

    public function __construct(Model $model) {
        $this->model = $model;
    }

    public function paginate($per_page) {
        return $this->model->paginate($per_page);
    }

    public function create($payload = []) {
        $this->model->create($payload);
    }

}
