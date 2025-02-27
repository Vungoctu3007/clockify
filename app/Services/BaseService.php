<?php
namespace App\Services;

class BaseService {
    protected $repository;

    public function __construct($repository = null) {
        $this->repository = $repository;
    }

    public function paginate($per_page) {
        return $this->repository->paginate($per_page);

    }

}
