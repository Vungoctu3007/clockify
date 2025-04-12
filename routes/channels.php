<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
use App\Models\User;

Broadcast::channel('task-reminders.{userId}', function (User $user, $userId) {
    $isAuthorized = $user && (int) $user->user_id === (int) $userId;
    Log::debug('Channel auth', ['user_id' => $user->user_id ?? null, 'channel_user_id' => $userId, 'authorized' => $isAuthorized]);
    return $isAuthorized;
});
