<?php
namespace App\Services;

use Illuminate\Http\Request;

class BaseService {
    protected $repository;

    public function __construct($repository = null) {
        $this->repository = $repository;
    }

    public function paginate(Request $request, $user_id = null) {
        $params = [
            'select' => $request->get('select', ['*']),
            'conditions' => $request->get('conditions', []),
            'keyword' => $request->get('keyword', ''),
            'searchColumns' => $request->get('searchColumns', []),
            'orderBy' => [
                'column' => $request->get('orderByColumn', 'created_at'),
                'direction' => $request->get('orderByDirection', 'asc'),
            ],
            'perPage' => $request->get('perPage', 10),
            'currentPage' => $request->get('currentPage', 1),
            'user_id' => $user_id
        ];

        return $this->repository->paginate($params);
    }

}
