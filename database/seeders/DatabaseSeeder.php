<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory(10)->create();
        User::factory()->create([
            'name' => 'Vũ Ngọc Tú',
            'email' => 'vungoctu12a3@gmail.com',
            'password' => Hash::make('password'),
            'address' => '119/30 Nguyễn Văn Cừ, phường 2, quận 5, HCM',
            'phone' => '0366456591'
        ]);
    }
}
