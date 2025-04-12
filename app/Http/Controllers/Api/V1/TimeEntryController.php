<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Repositories\TimeEntry\TimeEntryRepository;
use App\Services\TimeEntry\TimeEntryService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TimeEntryController extends Controller
{
    protected $timeEntryRepository;
    protected $timeEntryService;

    public function __construct(TimeEntryRepository $timeEntryRepository, TimeEntryService $timeEntryService) {
        $this->timeEntryRepository = $timeEntryRepository;
        $this->timeEntryService = $timeEntryService;
    }

    public function showCalendar(Request $request) {
        try {
            $userId = auth()->id();
            if(empty($userId)) {
                return response()->json([
                    'error' => 'Unauthenticated'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $timeEntries = $this->timeEntryService->getTimeEntriesWithProjectByUserId($userId);

            return response()->json([
                'data' => $timeEntries
            ], response::HTTP_OK);

        } catch(\Exception $e) {
            return response()->json([
                'message' => 'Error fetching time entries: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function create(Request $request) {
        $userId = auth()->id();


        if(empty($userId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $result = $this->timeEntryService->createTimeEntry($request, $userId);
        if($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => $result['message']
            ], Response::HTTP_CREATED);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], response::HTTP_BAD_REQUEST);
    }
    public function update(Request $request, $id)
    {
        $userId = auth()->id();

        if (empty($userId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $result = $this->timeEntryService->updateTimeEntry($request, $userId, $id);
        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => $result['message']
            ], Response::HTTP_OK);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], Response::HTTP_BAD_REQUEST);
    }

    public function delete($id) {
        $result = $this->timeEntryRepository->delete($id);

        if($result) {
            return response()->json([
                'success' => true,
            ], Response::HTTP_OK);
        }

        return response()->json([
            'success' => false,
        ], Response::HTTP_BAD_REQUEST);
    }

}
