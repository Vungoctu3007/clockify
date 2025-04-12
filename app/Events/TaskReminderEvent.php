<?php
namespace App\Events;

use App\Models\TimeEntry;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class TaskReminderEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $timeEntry;

    public function __construct(TimeEntry $timeEntry)
    {
        $this->timeEntry = $timeEntry;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('task-reminders.' . $this->timeEntry->user_id);
    }

    public function broadcastWith()
    {
        $taskName = $this->timeEntry->task ? $this->timeEntry->task->title : 'Unknown Task';
        $startTime = $this->timeEntry->start_time
            ? $this->timeEntry->start_time->format('H:i d/m/Y')
            : 'Unknown Time';

        $message = "Nhiệm vụ '{$taskName}' sắp bắt đầu lúc {$startTime}";

        // Lưu thông báo vào bảng notifications
        $notification = \App\Models\Notification::create([
            'user_id' => $this->timeEntry->user_id,
            'task_id' => $this->timeEntry->task_id,
            'message' => $message,
            'is_read' => 0,
        ]);

        // Trả về dữ liệu để gửi qua Pusher
        return [
            'title' => "Nhiệm vụ sắp bắt đầu",
            'content' => $message,
            'time' => now()->diffForHumans(), // Ví dụ: "2 phút trước"
            'isRead' => false,
        ];
    }
}
