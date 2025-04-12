<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimeEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'time_entry_id';

    protected $fillable = [
        'project_id',
        'task_id',
        'user_id',
        'start_time',
        'end_time',
        'duration',
        'description',
        'notified'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public $timestamps = false;

    // Mối quan hệ
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
