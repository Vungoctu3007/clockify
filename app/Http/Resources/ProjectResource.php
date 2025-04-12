<?php

namespace App\Http\Resources;

use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->project_id,
            'name' => $this->name,
            'user_id' => $this->creator_id,
            'color' => $this->color,
            'tasks' => TaskResource::collection($this->tasks)
        ];
    }
}
