<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;
use App\Models\Team;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectTeam>
 */
class ProjectTeamFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'team_id' => Team::factory(),
        ];
    }
}
