<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Http\Request;

class CustomBroadcastingAuth extends Controller
{
    public function __construct() {

    }

    public function handle(Request $request) {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 403);
        }
        $request->setUserResolver(fn () => $user);

        // Delegate to default broadcasting handler
        return Broadcast::auth($request);
    }
}
