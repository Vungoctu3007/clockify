<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeEntryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'time_entry_id' => $this->time_entry_id,
            'title' => $this->name,
            'start' => $this->start_time,
            'end' => $this->end_time,
            'borderColor' => $this->color,
            'textColor' => $this->color,
            'extendedProps' => [
                'description' => $this->description,
                'project_id' => $this->project_id,
                'task_id' => $this->task_id,
            ]
        ];
    }
}
