<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $primaryKey = 'team_id';

    protected $fillable = [
        'name',
    ];

    public $timestamps = false;

    // Mối quan hệ
    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'team_id', 'team_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_teams', 'team_id', 'project_id');
    }
}
