<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Models\Team;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        // Random giữa gán cho user hoặc team, hoặc không gán
        $assigneeType = $this->faker->randomElement(['user', 'team', 'none']);

        return [
            'project_id' => Project::factory(), // Tạo hoặc lấy project_id từ factory Project
            'parent_task_id' => null, // Mặc định không là sub-task, sẽ cấu hình riêng nếu cần
            'assignee_id' => $assigneeType === 'user' ? User::factory() : null, // Gán user nếu chọn 'user'
            'team_id' => $assigneeType === 'team' ? Team::factory() : null, // Gán team nếu chọn 'team'
            'title' => $this->faker->sentence(3), // Tiêu đề ngẫu nhiên (3 từ)
            'description' => $this->faker->paragraph(), // Mô tả ngẫu nhiên
            'status' => $this->faker->randomElement(['To Do', 'In Progress', 'Done']), // Trạng thái ngẫu nhiên
            'deadline' => $this->faker->dateTimeBetween('now', '+1 month'), // Deadline trong vòng 1 tháng tới
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'), // Thời gian tạo trong vòng 1 tháng qua
            'updated_at' => $this->faker->dateTimeBetween('-1 month', 'now'), // Thời gian cập nhật
        ];
    }

    // Trạng thái để tạo sub-task
    public function subTask(int $parentTaskId): static
    {
        return $this->state(function (array $attributes) use ($parentTaskId) {
            return [
                'parent_task_id' => $parentTaskId, // Gán parent_task_id để làm sub-task
                'team_id' => null, // Sub-task không gán cho team, chỉ cho user
                'assignee_id' => User::factory(), // Sub-task luôn gán cho user
            ];
        });
    }

    // Trạng thái để gán cho user
    public function assignedToUser(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'assignee_id' => User::factory(),
                'team_id' => null,
            ];
        });
    }

    // Trạng thái để gán cho team
    public function assignedToTeam(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'assignee_id' => null,
                'team_id' => Team::factory(),
            ];
        });
    }
}
