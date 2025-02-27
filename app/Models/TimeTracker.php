<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TimeTracker extends Model
{
    protected $fillable = [
        'name',
        'time_start',
        'time_end',
        'progress',
        'description',
    ];

    public function task():HasOne {
        return $this->hasOne(Task::class);
    }

    public function tags():HasMany {
        return $this->hasMany(Tag::class);
    }

    public function user():BelongsTo {
        return $this->belongsTo(User::class);
    }
}
