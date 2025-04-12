<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $primaryKey = 'tag_id';

    protected $fillable = [
        'name',
        'creator_id'
    ];

    public $timestamps = false;

    // Mối quan hệ
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_tags', 'tag_id', 'project_id');
    }
}
