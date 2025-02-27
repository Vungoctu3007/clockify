<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'name',
        'tracked',
        'color',
    ];

    public function timeTracker():BelongsTo {
        return $this->belongsTo(TimeTracker::class);
    }
}
