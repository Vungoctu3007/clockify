<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $table = 'team_members';

    protected $primaryKey = ['team_id', 'user_id'];

    public $incrementing = false;

    protected $fillable = [
        'team_id',
        'user_id',
        'role_id',
    ];

    public $timestamps = false;

    // Mối quan hệ
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }
}
