<?php
namespace App\Services\TimeEntry;

use App\Http\Resources\TimeEntryResource;
use App\Repositories\TimeEntry\TimeEntryRepository;
use App\Services\BaseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeEntryService extends BaseService {
    protected $timeEntryRepository;
    public function __construct(TimeEntryRepository $timeEntryRepository) {
        $this->timeEntryRepository = $timeEntryRepository;
    }

    public function getTimeEntriesWithProjectByUserId(int $userId) {
        if(empty($userId)) {
            throw new \Exception('User ID is required');
        }

        $timeEntries = $this->timeEntryRepository->getTimeEntriesWithProjectByUserId($userId);
        return TimeEntryResource::collection($timeEntries);
    }


    public function createTimeEntry(Request $request, $userId) {
        try{
            DB::beginTransaction();

            $payload = [
                'project_id' => $request->get('project_id'),
                'task_id' => $request->get('task_id'),
                'user_id' => $userId,
                'start_time' => $request->get('start_time'),
                'end_time' => $request->get('end_time'),
                'description' => $request->get('description')
            ];

            $timeEntry = $this->timeEntryRepository->create($payload);
            DB::commit();

            return [
                'success' => true,
                'data' => $timeEntry,
                'message' => 'Time entry created successfully'
            ];
        }catch(Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to create time entry: ' . $e->getMessage()
            ];
        }
    }

    public function updateTimeEntry(Request $request, $userId, $id) {
        try {
            DB::beginTransaction();

            $payload = array_filter([
                'project_id' => $request->get('project_id'),
                'task_id' => $request->get('task_id'),
                'user_id' => $userId,
                'start_time' => $request->get('start_time'),
                'end_time' => $request->get('end_time'),
                'description' => $request->get('description')
            ], function($value) {
                return !is_null($value);
            });
            // First, verify the time entry exists and belongs to the user
            $timeEntry = $this->timeEntryRepository->find($id);
            if(!$timeEntry || $timeEntry->user_id !== $userId) {
                return [
                    'success' => false,
                    'message' => 'Time entry not found or unauthorized'
                ];
            }

            $updatedTimeEntry = $this->timeEntryRepository->update($id, $payload);
            DB::commit();

            return [
                'success' => true,
                'data' => $updatedTimeEntry,
                'message' => 'Time entry updated successfully'
            ];
        } catch(Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to update time entry: ' . $e->getMessage()
            ];
        }
    }
}
