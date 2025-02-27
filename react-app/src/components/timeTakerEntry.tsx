import React from "react";
import BasicInput from '@/components/input';
import TimePicker from '@/components/timePicker';
import BasicButton from '@/components/basicButton';
import { Tags, Play, CirclePlus } from 'lucide-react';

const TimeTrackerEntry: React.FC = () => {
    return (
        <div className="flex items-center gap-4 bg-white p-3">
            <BasicInput
                type="text"
                placeholder="What have you worked on?"
                className="outline-hidden"
            />
            <BasicButton
                content={
                    <CirclePlus size={48} color="#3B82F6" strokeWidth={1.25} />
                }
                label="Project"
            />
            <Tags size={48} color="#3B82F6" strokeWidth={1.25} />
            <TimePicker />
            -
            <TimePicker />
            <BasicButton
                content={<Play />}
                className="bg-blue-500 text-white hover:bg-white hover:text-blue-400"
                label="ADD"
            />
        </div>
    );
};

export default TimeTrackerEntry;
