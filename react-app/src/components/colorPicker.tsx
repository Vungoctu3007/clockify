import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState, useEffect } from "react";
import BasicInput from "./input";

const colors: string[] = [
    "#FF5733", // Red
    "#FFC300", // Yellow
    "#28A745", // Green
    "#007BFF", // Blue
    "#6F42C1", // Purple
    "#17A2B8", // Teal
    "#E83E8C", // Pink
    "#FD7E14", // Orange
    "#343A40", // Dark
];
type ColorPickerProps = {
    onColorChange: (color: string) => void;
    initialColor?: string;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange, initialColor = "#007BFF" }) => {
    const [selectedColor, setSelectedColor] = useState<string>(initialColor);

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        onColorChange(color); // Gửi màu đã chọn về component cha
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setSelectedColor(color);
        onColorChange(color); // Gửi màu custom về component cha
    };

    useEffect(() => {
        setSelectedColor(initialColor);
    }, [initialColor]);

    return (
        <div className="flex justify-start items-center space-y-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="mr-2" variant="outline">
                        Choose color
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32">
                    <div className="flex flex-col items-center pb-2">
                        <div className="grid grid-cols-3 gap-4">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorClick(color)}
                                    className={`w-6 h-6 rounded-full shadow-md border-2 ${
                                        selectedColor === color
                                            ? "border-black"
                                            : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center mt-2">
                        <input
                            type="color"
                            className="w-7 h-7 m-0 p-0 border-none outline-none rounded-full"
                            value={selectedColor}
                            onChange={handleCustomColorChange}
                        />
                        <span className="ml-2 text-sm font-thin text-gray-500">Custom</span>
                    </div>
                </PopoverContent>
            </Popover>

            <Button
                variant="default"
                className="flex items-center rounded-sm space-x-2 !m-0 ml-2"
                style={{ backgroundColor: selectedColor || "#007BFF" }}
            />
        </div>
    );
};

export default ColorPicker;
