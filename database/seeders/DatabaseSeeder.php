<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\Team;
use App\Models\Role;
use App\Models\Tag;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\TeamMember;
use App\Models\ProjectTeam;
use App\Models\ProjectTag;
use App\Models\Notification;
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
        // Tạo roles trước
        Role::factory()->count(4)->create();

        // Tạo users
        User::factory()->count(10)->create();

        // Tạo teams
        Team::factory()->count(5)->create();

        // Tạo tags
        Tag::factory()->count(10)->create();

        // Tạo projects
        Project::factory()->count(20)->create();

        // Tạo tasks
        Task::factory()->count(50)->create();

        // Tạo time entries
        TimeEntry::factory()->count(100)->create();

        // Tạo team members
        TeamMember::factory()->count(30)->create();

        // Tạo project-team relationships
        ProjectTeam::factory()->count(40)->create();

        // Tạo project-tag relationships
        ProjectTag::factory()->count(60)->create();

        // Tạo notifications
        Notification::factory()->count(50)->create();
    }
}
