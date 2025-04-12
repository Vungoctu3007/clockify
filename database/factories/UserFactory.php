<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'province_id' => $this->faker->numerify('##'), // Sinh mã tỉnh giả (2 chữ số)
            'district_id' => $this->faker->numerify('###'), // Sinh mã quận giả (3 chữ số)
            'ward_id' => $this->faker->numerify('#####'), // Sinh mã phường giả (5 chữ số)
            'address' => $this->faker->address(),
            'birthday' => $this->faker->dateTimeBetween('-50 years', '-18 years'),
            'image' => $this->faker->imageUrl(200, 200, 'people'),
            'description' => $this->faker->paragraph(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Mật khẩu mặc định: "password"
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
