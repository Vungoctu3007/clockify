<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTag extends Model
{
    use HasFactory;

    protected $table = 'project_tags';

    protected $primaryKey = ['project_id', 'tag_id'];

    public $incrementing = false;

    protected $fillable = [
        'project_id',
        'tag_id',
    ];

    public $timestamps = false;

    // Mối quan hệ
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class, 'tag_id', 'tag_id');
    }
}
