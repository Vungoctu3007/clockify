import BasicButton from "@/components/basicButton";
import { BasicPagination } from "@/components/basicPagination";
import BasicSelect from "@/components/basicSelect";
import BasicInput from "@/components/input";
import BasicModal from "@/components/modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { IProject, ProjectResponse } from "@/interfaces/type/project";
import { setToast } from "@/redux/slice/toastSlice";
import { save, pagination } from "@/services/projectService";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Dot } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

interface Conditions {
    type?: string;
    access?: string;
    [key: string]: any;
}

const Projects: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [accesses, setAccesses] = useState<string[]>([]);
    const [select, setSelect] = useState<string[]>(["*"]);
    const [conditions, setConditions] = useState<Conditions>({});
    const [keyword, setKeyword] = useState<string>("");
    const [searchColumns, setSearchColumns] = useState<string[]>(["name"]);
    const [orderBy, setOrderBy] = useState([{ column: "", direction: "" }]);
    const [perPage, setPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const dispatch = useDispatch();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const paginate = useCallback(async () => {
        try {
            const queryString = {
                select,
                conditions,
                keyword,
                searchColumns,
                orderBy,
                perPage,
                currentPage,
            };
            const response = await pagination(queryString);
            setProjects(response.projects.data);
            setAccesses(response.accesses);
            setTotalPages(Math.ceil(response.projects.total / perPage));
        } catch (error) {
            console.error("Pagination error:", error);
        }
    }, [
        select,
        conditions,
        keyword,
        searchColumns,
        orderBy,
        perPage,
        currentPage,
    ]);

    useEffect(() => {
        paginate();
    }, [paginate]);

    const handleCreateProject = async (project: IProject) => {
        const response = await save(project, {
            action: "create",
            id: undefined,
        });

        if (response) {
            dispatch(
                setToast({
                    message: "Add new project successfully",
                    type: "success",
                })
            );
            paginate();
        }
    };

    const handleAccessChange = (value: string) => {
        setConditions((prev) => ({
            ...prev,
            access: value === "all" ? undefined : value,
        }));
        setCurrentPage(1);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-stone-500">
                    Projects
                </h1>
                <BasicButton content="create new project" onClick={openModal} />
            </div>
            <BasicModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCreate={handleCreateProject}
                title="CREATE NEW PROJECT"
                fields={[
                    {
                        label: "Name",
                        type: "text",
                        key: "name",
                        defaultValue: "",
                    },
                    {
                        label: "Color",
                        type: "color",
                        key: "color",
                        defaultValue: "#FF0000",
                    },
                    {
                        label: "Access",
                        type: "select",
                        key: "access",
                        options: accesses,
                        defaultValue: accesses[0],
                    },
                ]}
            />
            <div className="mb-10">
                <div className="flex space-x-4 border border-gray-200 rounded px-4 h-14 items-center bg-white shadow-md">
                    <div className="text-violet-500 uppercase">filter</div>
                    <BasicSelect
                        placeholder="Access"
                        options={accesses}
                        value={conditions.access || ""}
                        onChange={handleAccessChange}
                    />
                    <BasicInput
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Find by name"
                    />
                    <BasicButton content="apply filter" />
                </div>
            </div>

            <table className="w-full table-auto bg-white border border-gray-200 shadow-md">
                <thead className="bg-gray-100">
                    <tr className="bg-sky-50">
                        <th className="px-4 text-left">
                            <Checkbox id="terms" />
                        </th>
                        <th className="px-4 h-14 text-left">Name</th>
                        <th className="px-4 h-14 text-left">Tracked</th>
                        <th className="px-4 h-14 text-left">Progress</th>
                        <th className="px-4 h-14 text-left">Access</th>
                        <th className="px-4 h-14 text-left">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr
                            key={project.project_id}
                            className="border-b hover:bg-gray-50"
                        >
                            <td className="px-4 text-left">
                                <Checkbox id={`terms${project.project_id}`} />
                            </td>
                            <td className="px-4 h-14 flex items-center justify-start">
                                <Link
                                    to={`/projects/${project.project_id}/edit`}
                                    className="flex items-center"
                                >
                                    <span>
                                        <Dot
                                            color={project.color || "gray"}
                                            size={30}
                                        />
                                    </span>
                                    {project.name}
                                </Link>
                            </td>
                            <td className="px-4 h-14 text-left">
                                {project.tracked_time}
                            </td>
                            <td className="px-4 h-14 text-left">
                                <Progress value={project.progress} />
                            </td>
                            <td className="px-4 h-14 text-left">
                                {project.access}
                            </td>
                            <td className="px-4 h-14 text-center">
                                <button className="text-blue-500 text-left">
                                    ⋮
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <BasicPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default Projects;
