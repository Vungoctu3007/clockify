<?php
namespace App\Repositories\TimeEntry;

use App\Repositories\BaseRepository;
use App\Models\TimeEntry;
class TimeEntryRepository extends BaseRepository
{
    protected $model;

    public function __construct(TimeEntry $model)
    {
        parent::__construct($model);
    }

    public function getTimeEntriesWithProjectByUserId(int $userId)
    {
        return $this->model->query()
            ->where('time_entries.user_id', $userId)
            ->select(
                'time_entries.time_entry_id',
                'projects.name',
                'projects.color',
                'time_entries.start_time',
                'time_entries.end_time',
                'time_entries.project_id',
                'time_entries.task_id',
                'time_entries.description',
            )
            ->leftJoin('projects', 'time_entries.project_id', '=', 'projects.project_id')
            ->get();
    }

    


}
