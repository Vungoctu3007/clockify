/* REACT */
import { useState } from "react";

/* COMPONENT */
import BasicButton from "./basicButton";
import BasicInput from "./input";
import ColorPicker from "./colorPicker";

/* SETTING */
import { ITask } from "@/interfaces/type/task";

interface modalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTask: (task: ITask) => void
}

const BasicModal: React.FC<modalProps> = ({ isOpen, onClose, onCreateTask }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#007BFF");

    const handleCreateTask = () => {
        onCreateTask({ name, color });
        setName("")
        setColor("#007BFF")
        onClose()
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
            <div
                id="default-modal"
                aria-hidden={!isOpen}
                className={`${
                    isOpen ? "flex" : "hidden"
                } overflow-y-auto fixed inset-0 z-50 justify-center items-center`}
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-medium">CREATE NEW TASK</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
                                ✕
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <BasicInput
                                type="text"
                                placeholder="Enter task name"
                                taskName={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <ColorPicker
                                onColorChange={setColor}
                                initialColor={color}
                            />
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            <BasicButton
                                content="Cancel"
                                onClick={onClose}
                                className="mr-3 bg-red-600 text-white"
                            />
                            <BasicButton
                                content="Create"
                                onClick={handleCreateTask}
                                className="bg-blue-600 text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BasicModal;
