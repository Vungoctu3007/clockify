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

// Định nghĩa kiểu cho props
interface SelectOption {
    placeholder?: string,
    options: string[]; // Mảng các giá trị (ví dụ: ['Personal', 'Community', 'Team'])
    value?: string; // Giá trị hiện tại
    onChange?: (value: string) => void; // Hàm xử lý khi chọn giá trị
}

const BasicSelect = ({ placeholder, options, value, onChange }: SelectOption) => {
    return (
        <Select value={value ?? "all"} onValueChange={onChange}> {/* Thêm disabled */}
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default BasicSelect;
