<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $primaryKey = 'task_id';

    // Các cột có thể điền dữ liệu
    protected $fillable = [
        'project_id',
        'parent_task_id',
        'assignee_id',
        'team_id',
        'title',
        'description',
        'status',
        'deadline',
    ];

    // Ép kiểu dữ liệu
    protected $casts = [
        'status' => 'string', // Ép kiểu status thành chuỗi
        'deadline' => 'datetime', // Ép kiểu deadline thành datetime
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Mối quan hệ

    // Thuộc về một project
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }

    // Thuộc về một user (assignee)
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id', 'user_id');
    }

    // Thuộc về một team
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }

    // Task cha (nếu là sub-task)
    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_task_id', 'task_id');
    }

    // Các sub-task (nếu là task chính)
    public function subTasks()
    {
        return $this->hasMany(Task::class, 'parent_task_id', 'task_id');
    }

    // Các bản ghi thời gian liên quan
    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class, 'task_id', 'task_id');
    }

    // Các thông báo liên quan
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'task_id', 'task_id');
    }

    // Scope để lấy task chính (không phải sub-task)
    public function scopeMainTasks($query)
    {
        return $query->whereNull('parent_task_id');
    }

    // Scope để lấy sub-task
    public function scopeSubTasks($query)
    {
        return $query->whereNotNull('parent_task_id');
    }

    // Kiểm tra task có phải hoàn thành không
    public function isCompleted()
    {
        return $this->status === 'Done';
    }

    // Tính trạng thái task cấp team dựa trên sub-task
    public function calculateStatus()
    {
        if ($this->subTasks->isEmpty()) {
            return $this->status; // Nếu không có sub-task, trả về status hiện tại
        }

        $subTaskStatuses = $this->subTasks->pluck('status')->toArray();

        if (empty(array_diff($subTaskStatuses, ['Done']))) {
            return 'Done'; // Tất cả sub-task đều Done
        } elseif (in_array('In Progress', $subTaskStatuses)) {
            return 'In Progress'; // Có ít nhất 1 sub-task đang In Progress
        } else {
            return 'To Do'; // Tất cả sub-task đều To Do
        }
    }
}
