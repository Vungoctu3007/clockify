<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    protected $fillable = [
        'name',

    ];

    public function timeTracker(): BelongsTo {
        return $this->belongsTo(TimeTracker::class);
    }
}
