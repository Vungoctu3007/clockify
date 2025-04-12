import React, { useState, useEffect, useRef } from 'react';
import { format, parse } from 'date-fns';
import BasicInput from './input';
interface TimeEntryInputProps {
    onAdd: (entry: {
        description: string;
        project_id: number;
        start_time: string;
        end_time?: string;
        duration?: number;
    }) => void;
}

const TimeEntryInput: React.FC<TimeEntryInputProps> = ({ onAdd }) => {
    const [mode, setMode] = useState<'manual' | 'timer'>('manual');
    const [description, setDescription] = useState<string>('');
    const [projectId, setProjectId] = useState<number>(1);
    const [startTime, setStartTime] = useState<string>('21:39');
    const [endTime, setEndTime] = useState<string>('21:39');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Allow null
    const [timer, setTimer] = useState<number>(0);
    const [isTracking, setIsTracking] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTracking) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTracking = () => {
        setIsTracking(true);
    };

    const stopTracking = () => {
        setIsTracking(false);
        const start = new Date();
        const end = new Date(start.getTime() + timer * 1000);
        onAdd({
            description,
            project_id: projectId,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            duration: timer / 3600,
        });
        setTimer(0);
    };

    const addManualEntry = () => {
        if (!startTime || !endTime || !selectedDate) return;

        const start = parse(startTime, 'HH:mm', selectedDate);
        const end = parse(endTime, 'HH:mm', selectedDate);
        const duration = (end.getTime() - start.getTime()) / 1000 / 3600;

        onAdd({
            description,
            project_id: projectId,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            duration,
        });

        setDescription('');
        setStartTime('');
        setEndTime('');
    };

    // Handle DatePicker onChange
    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
        } else {
            // Nếu date là null, có thể đặt lại về ngày hiện tại hoặc xử lý khác
            setSelectedDate(new Date());
        }
    };

    return (
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow relative">
            <input
                type="text"
                placeholder={mode === 'timer' ? 'What are you working on?' : 'What have you worked on?'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
                <select
                    value={projectId}
                    onChange={(e) => setProjectId(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={1}>OOP</option>
                    <option value={2}>personal project</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            </button>
            {mode === 'manual' ? (
                <div className="flex items-center space-x-2">
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                    <span>-</span>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                    <BasicInput type='date'/>
                </div>
            ) : (
                <span className="text-gray-500">{formatTime(timer)}</span>
            )}
            {mode === 'manual' ? (
                <button
                    onClick={addManualEntry}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    ADD
                </button>
            ) : (
                <button
                    onClick={isTracking ? stopTracking : startTracking}
                    className={`px-4 py-2 rounded text-white ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {isTracking ? 'STOP' : 'START'}
                </button>
            )}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                >
                    ⋮
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button
                            onClick={() => {
                                setMode('timer');
                                setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Bấm giờ
                        </button>
                        <button
                            onClick={() => {
                                setMode('manual');
                                setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Lên lịch
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeEntryInput;
