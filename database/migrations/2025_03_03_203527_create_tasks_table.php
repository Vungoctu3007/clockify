<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id('task_id'); // Khóa chính, tự tăng
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Khóa ngoại tới Projects
            $table->foreignId('parent_task_id')->nullable()->constrained('tasks', 'task_id')->onDelete('cascade'); // Khóa ngoại tới chính Tasks (sub-task)
            $table->foreignId('assignee_id')->nullable()->constrained('users', 'user_id')->onDelete('set null'); // Gán cho user, nullable
            $table->foreignId('team_id')->nullable()->constrained('teams', 'team_id')->onDelete('set null'); // Gán cho team, nullable
            $table->string('title'); // Tiêu đề task
            $table->text('description')->nullable(); // Mô tả task, nullable
            $table->enum('status', ['To Do', 'In Progress', 'Done'])->default('To Do'); // Trạng thái task
            $table->dateTime('deadline')->nullable(); // Hạn chót, nullable
            $table->timestamps(); // created_at và updated_at

            // Index để tối ưu truy vấn
            $table->index(['project_id', 'parent_task_id']);
            $table->index(['assignee_id']);
            $table->index(['team_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
