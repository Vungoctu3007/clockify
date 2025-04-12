<?php
namespace App\Console\Commands;

use App\Events\TaskReminderEvent;
use App\Models\TimeEntry;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckTaskReminders extends Command
{
    protected $signature = 'task:check-reminders';
    protected $description = 'Check and send reminders for upcoming tasks';

    public function handle()
    {
        $now = Carbon::now();
        $reminderTime = $now->copy()->addMinutes(5);

        Log::info('Starting task:check-reminders', [
            'now' => $now->toDateTimeString(),
            'reminderTime' => $reminderTime->toDateTimeString(),
        ]);

        $timeEntries = TimeEntry::where('start_time', '<=', $reminderTime)
            ->where('start_time', '>=', $now->subMinute())
            ->where('notified', false)
            ->whereNotNull('task_id')
            ->with('task')
            ->get();

        Log::info('Found TimeEntries', [
            'count' => $timeEntries->count(),
            'entries' => $timeEntries->toArray(),
        ]);

        foreach ($timeEntries as $entry) {
            if ($entry->task) {
                Log::info('Processing TimeEntry', [
                    'time_entry_id' => $entry->time_entry_id,
                    'task_name' => $entry->task->title,
                    'start_time' => $entry->start_time->toDateTimeString(),
                    'user_id' => $entry->user_id,
                ]);

                event(new TaskReminderEvent($entry));
                $entry->update(['notified' => true]);
                $this->info("Sent reminder for task: {$entry->task->title}");
            } else {
                Log::warning('Skipped TimeEntry due to missing task', [
                    'time_entry_id' => $entry->time_entry_id,
                ]);
                $this->warn("Skipped TimeEntry ID {$entry->time_entry_id}: Task not found");
            }
        }
        $this->info('Task reminders checked successfully.');
    }
}
