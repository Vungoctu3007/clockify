import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectOption {
    key: string;
    value: string;
}

interface BasicSelectProps {
    options: SelectOption[];
}

const BasicSelect = ({ options }: BasicSelectProps) => {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option.key} value={option.value}>
                            {option.key}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default BasicSelect;
