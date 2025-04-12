<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $primaryKey = 'project_id';

    protected $fillable = [
        'name',
        'color',
        'tracked_time',
        'amount',
        'progress',
        'access',
        'type',
        'creator_id'
    ];

    protected $casts = [
        'access' => 'string',
        'type' => 'string',
    ];

    public const TYPES = ['Personal', 'Community', 'Team'];
    public const ACCESSES = ['Public', 'Private'];

    public static function getTypes() {
        return self::TYPES;
    }

    public static function getAccesses() {
        return self::ACCESSES;
    }
    // Mối quan hệ
    
    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id', 'project_id');
    }

    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class, 'project_id', 'project_id');
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'project_teams', 'project_id', 'team_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'project_tags', 'project_id', 'tag_id');
    }
}
