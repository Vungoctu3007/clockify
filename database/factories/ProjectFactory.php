<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'tracked_time' => $this->faker->randomFloat(2, 0, 100), // Giả lập thời gian từ 0-100 giờ
            'amount' => $this->faker->randomFloat(2, 0, 10000), // Giả lập số tiền từ 0-10000
            'progress' => $this->faker->numberBetween(0, 100),
            'access' => $this->faker->randomElement(['Public', 'Private']),
            'type' => $this->faker->randomElement(['Personal', 'Community', 'Team']),
            'creator_id' => User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
