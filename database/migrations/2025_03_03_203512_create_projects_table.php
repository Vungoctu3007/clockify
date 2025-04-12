<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id('project_id');
            $table->string('name');
            $table->decimal('tracked_time', 10, 2)->default(0.00);
            $table->decimal('amount', 10, 2)->default(0.00);
            $table->integer('progress')->default(0);
            $table->enum('access', ['Public', 'Private'])->default('Public');
            $table->enum('type', ['Personal', 'Community', 'Team']);
            $table->foreignId('creator_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
