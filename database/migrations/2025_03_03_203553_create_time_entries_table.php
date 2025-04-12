<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_entries', function (Blueprint $table) {
            $table->id('time_entry_id');
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade');
            $table->foreignId('task_id')->nullable()->constrained('tasks', 'task_id')->onDelete('set null');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->decimal('duration', 10, 2)->nullable();
            $table->timestamp('created_at')->useCurrent();
            // Thêm index để tối ưu truy vấn
            $table->index('start_time');
            $table->index('user_id');
            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_entries');
    }
};
