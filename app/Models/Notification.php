<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon;

class Notification extends Model
{
    use HasFactory;

    protected $primaryKey = 'notification_id';

    protected $fillable = [
        'user_id',
        'task_id',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    protected $dates = ['created_at'];

    public $timestamps = false;

    // Mối quan hệ
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }
}
