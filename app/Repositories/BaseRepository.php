<?php
namespace App\Repositories;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class BaseRepository {
    protected $model;

    public function __construct(Model $model) {
        $this->model = $model;
    }

    public function paginate($params = [], $query = null) {
        $query = $query ?? $this->model->newQuery();

        if (!empty($params['select'])) {
            $query->select($params['select']);
        }

        if (!empty($params['conditions'])) {
            foreach ($params['conditions'] as $column => $value) {
                $query->where($column, $value);
            }
        }

        if (!empty($params['keyword']) && !empty($params['searchColumns'])) {
            $query->where(function ($subQuery) use ($params) {
                foreach ($params['searchColumns'] as $column) {
                    $subQuery->orWhere($column, 'LIKE', '%' . $params['keyword'] . '%');
                }
            });
        }

        if (!empty($params['orderBy'])) {
            $query->orderBy(
                $params['orderBy']['column'],
                $params['orderBy']['direction'] ?? 'asc'
            );
        }

        $perPage = $params['perPage'] ?? 10;
        $currentPage = $params['currentPage'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $currentPage);
    }

    public function all(array $payload = [], $query = null): Collection
    {
        $query = $query ?? $this->model->newQuery();

        if(!empty($payload)) {
            if (!empty($payload['select'])) {
                $query->select($payload['select']);
            }

            if (!empty($payload['conditions'])) {
                foreach ($payload['conditions'] as $column => $value) {
                    $query->where($column, $value);
                }
            }

            if (!empty($payload['keyword']) && !empty($payload['searchColumns'])) {
                $query->where(function ($subQuery) use ($payload) {
                    foreach ($payload['searchColumns'] as $column) {
                        $subQuery->orWhere($column, 'LIKE', '%' . $payload['keyword'] . '%');
                    }
                });
            }

            if (!empty($payload['orderBy'])) {
                $query->orderBy(
                    $payload['orderBy']['column'],
                    $payload['orderBy']['direction'] ?? 'asc'
                );
            }

        }

        return $query->get();
    }

    public function with($relation) {
        return $this->model->with($relation);
    }

    public function find($id) {
        return $this->model->findOrFail($id);
    }

    public function create($payload = []) {
        return $this->model->create($payload);
    }

    public function update($id, array $data): bool
    {
        $instance = $this->model->find($id);
        return $instance ? $instance->update($data) : false;
    }

    public function delete($id): bool
    {
        $instance = $this->model->find($id);
        return $instance ? $instance->delete() : false;
    }

    public function query()
    {
        return $this->model->newQuery();
    }
}
