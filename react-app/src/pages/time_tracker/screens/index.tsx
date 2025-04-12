import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import TimeEntryInput from '@/components/timeTakerEntry';

interface TimeEntry {
    time_entry_id: number;
    description: string;
    project_name: string;
    tag_name?: string;
    start_time: string;
    end_time?: string;
    duration: number;
    created_at: string;
}

interface DailyEntry {
    date: string;
    total_time: string;
    entries: TimeEntry[];
}

const TimeTracking: React.FC = () => {
    const [entries, setEntries] = useState<DailyEntry[]>([
        // Dữ liệu mẫu ban đầu giống trong hình
        {
            date: '2025-03-09', // Today
            total_time: '00:00:01',
            entries: [
                {
                    time_entry_id: 1,
                    description: 'Add description',
                    project_name: 'OOP',
                    start_time: '2025-03-09T21:37:00',
                    end_time: '2025-03-09T21:37:01',
                    duration: 0.00027778, // 1 giây
                    created_at: '2025-03-09T21:37:00',
                },
            ],
        },
        {
            date: '2025-03-05', // Wed, Mar 5
            total_time: '01:20:00',
            entries: [
                {
                    time_entry_id: 2,
                    description: 'Add description',
                    project_name: 'OOP',
                    start_time: '2025-03-05T10:05:00',
                    end_time: '2025-03-05T11:25:00',
                    duration: 1.333333, // 1 giờ 20 phút
                    created_at: '2025-03-05T10:05:00',
                },
            ],
        },
        {
            date: '2025-03-04', // Tue, Mar 4
            total_time: '02:15:00',
            entries: [
                {
                    time_entry_id: 3,
                    description: 'Add description',
                    project_name: 'personal project',
                    start_time: '2025-03-04T01:45:00',
                    end_time: '2025-03-04T04:00:00',
                    duration: 2.25, // 2 giờ 15 phút
                    created_at: '2025-03-04T01:45:00',
                },
            ],
        },
    ]);
    const [weekTotal, setWeekTotal] = useState<string>('03:35:01'); // Tổng thời gian tuần (giả lập)

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddEntry = (entry: {
        description: string;
        project_id: number;
        start_time: string;
        end_time?: string;
        duration?: number;
    }) => {
        const newEntry: TimeEntry = {
            time_entry_id: Math.random(), // Thay bằng ID từ API
            description: entry.description || 'Add description',
            project_name: 'Project ' + entry.project_id, // Giả lập tên dự án
            start_time: entry.start_time,
            end_time: entry.end_time,
            duration: entry.duration || 0,
            created_at: entry.start_time,
        };

        const entryDate = format(new Date(entry.start_time), 'yyyy-MM-dd');
        setEntries(prev => {
            const existingDay = prev.find(day => day.date === entryDate);
            if (existingDay) {
                existingDay.entries.push(newEntry);
                // Cập nhật total_time
                const totalSeconds = existingDay.entries.reduce((sum, e) => sum + e.duration * 3600, 0);
                existingDay.total_time = formatTime(totalSeconds);
                return [...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            return [
                {
                    date: entryDate,
                    total_time: formatTime((entry.duration || 0) * 3600),
                    entries: [newEntry],
                },
                ...prev,
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });

        // Cập nhật tổng thời gian tuần (giả lập)
        const totalWeekSeconds = entries.reduce(
            (sum, day) => sum + day.entries.reduce((daySum, e) => daySum + e.duration * 3600, 0),
            0
        );
        setWeekTotal(formatTime(totalWeekSeconds + (entry.duration || 0) * 3600));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Component nhập thời gian */}
            <TimeEntryInput onAdd={handleAddEntry} />

            {/* Danh sách thời gian */}
            <div className="mt-6 flex justify-between">
                <h2 className="text-xl font-bold">This week</h2>
                <div>
                    <span className="text-gray-500">Week total: {weekTotal}</span>
                </div>
            </div>

            {entries.map((dailyEntry) => (
                <div key={dailyEntry.date} className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 flex justify-between">
                        <span>
                            {format(new Date(dailyEntry.date), 'EEE, MMM d') ===
                            format(new Date(), 'EEE, MMM d')
                                ? 'Today'
                                : format(new Date(dailyEntry.date), 'EEE, MMM d')}
                        </span>
                        <span className="text-gray-500">
                            TOTAL: {dailyEntry.total_time}{' '}
                            <button className="ml-2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </button>
                        </span>
                    </h3>
                    {dailyEntry.entries.map((entry) => (
                        <div
                            key={entry.time_entry_id}
                            className="flex items-center justify-between bg-white p-4 mb-2 rounded-lg shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <span className="text-blue-500">{entry.description}</span>
                                <span className="flex items-center space-x-2">
                                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                                    <span>{entry.project_name}</span>
                                    {entry.tag_name && (
                                        <span className="flex items-center space-x-1">
                                            <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                                            <span>{entry.tag_name}</span>
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500">
                                    {format(new Date(entry.start_time), 'HH:mm')} -{' '}
                                    {entry.end_time
                                        ? format(new Date(entry.end_time), 'HH:mm')
                                        : '--:--'}
                                </span>
                                <span className="text-gray-500">
                                    {formatTime(entry.duration * 3600)}
                                </span>
                                <button className="text-blue-500">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                                <button className="text-gray-500">⋮</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TimeTracking;
