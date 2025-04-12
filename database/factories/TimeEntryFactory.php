<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeEntry>
 */
class TimeEntryFactory extends Factory
{
    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('-1 month', 'now');
        $endTime = $this->faker->dateTimeBetween($startTime, 'now');
        $duration = (strtotime($endTime->format('Y-m-d H:i:s')) - strtotime($startTime->format('Y-m-d H:i:s'))) / 3600;

        return [
            'project_id' => Project::factory(),
            'task_id' => Task::factory(),
            'user_id' => User::factory(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration, // Tính duration (giờ) từ start_time và end_time
            'created_at' => now(),
        ];
    }
}
