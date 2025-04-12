<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;
use App\Models\Tag;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectTag>
 */
class ProjectTagFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'tag_id' => Tag::factory(),
        ];
    }
}
