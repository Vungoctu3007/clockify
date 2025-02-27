import BasicButton from "@/components/basicButton";
import { BasicPagination } from "@/components/basicPagination";
import BasicSelect from "@/components/basicSelect";
import BasicInput from "@/components/input";
import BasicModal from "@/components/modal";
import { Checkbox } from "@/components/ui/checkbox";
import { ITask } from "@/interfaces/type/task";
import { setToast } from "@/redux/slice/toastSlice";
import { Dot } from 'lucide-react';
/* SERVICE */
import { save, pagination } from "@/services/taskService";
import React, { useEffect } from "react";
import { useState } from "react";
/* REDUX */
import { useDispatch } from "react-redux";


const options = [
    {
        key: "apple",
        value: "apple",
    },
    {
        key: "banana",
        value: "banana",
    },
];

const Tasks: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const dispatch = useDispatch();

    const paginate = async (queryString: string) => {
        const response = await pagination(queryString);
        console.log(response.data)
        setTasks(response.data);
    };

    useEffect(() => {
        paginate("perPage=10");
    }, []);

    const handleCreateTask = async (task: ITask) => {
        const response = await save(task, { action: "create", id: undefined });

        response &&
            dispatch(
                setToast({
                    message: "Add new task successfully",
                    type: "success",
                })
            );
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Projects</h1>
                <BasicButton content="create new project" onClick={openModal} />
            </div>
            <BasicModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCreateTask={handleCreateTask}
            />
            <div className="mb-4">
                <div className="flex space-x-4 border border-gray-300 rounded px-4 h-14 items-center">
                    <div className="text-violet-500 uppercase">filter</div>
                    <BasicSelect options={options} />
                    <BasicSelect options={options} />
                    <BasicSelect options={options} />

                    <BasicInput type="email" placeholder="Find by name" />
                    <BasicButton content="apply filter" />
                </div>
            </div>

            <table className="w-full table-auto bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 text-left">
                            <Checkbox id="terms" />
                        </th>
                        <th className="px-4 h-14 text-left">Name</th>
                        <th className="px-4 h-14 text-left">Tracked</th>
                        <th className="px-4 h-14 text-left">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-4 text-left">
                                <Checkbox id={`terms${task.id}`} />
                            </td>
                            <td className="px-4 h-14 flex items-center justify-start"><span><Dot color={task.color || 'gray'} size={30} /></span>{task.name}</td>
                            <td className="px-4 h-14 text-left">{task.tracked}</td>
                            <td className="px-4 h-14  text-left">
                                <button className="text-blue-500 text-left">⋮</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <BasicPagination />
        </div>
    );
};

export default Tasks;
