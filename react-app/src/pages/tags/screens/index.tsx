import BasicButton from "@/components/basicButton";
import { BasicPagination } from "@/components/basicPagination";
import BasicSelect from "@/components/basicSelect";
import BasicInput from "@/components/input";
import BasicModal from "@/components/modal";
import { Checkbox } from "@/components/ui/checkbox";
import { setToast } from "@/redux/slice/toastSlice";
import { create, update, pagination, deleteTag } from "@/services/tagService";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface Conditions {
    type?: string;
    access?: string;
    [key: string]: any;
}

interface ITag {
    tag_id?: number;
    creator_id?: number;
    name: string;
    created_at?: string;
}

interface TagInput {
    name: string;
}

const Tags: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<ITag[]>([]);
    const [select, setSelect] = useState<string[]>(["*"]);
    const [conditions, setConditions] = useState<Conditions>({});
    const [keyword, setKeyword] = useState<string>("");
    const [searchColumns, setSearchColumns] = useState<string[]>(["name"]);
    const [orderBy, setOrderBy] = useState([{ column: "", direction: "" }]);
    const [perPage, setPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
    const dispatch = useDispatch();

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openEditModal = (tag: ITag) => {
        setSelectedTag(tag);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setSelectedTag(null);
        setIsEditModalOpen(false);
    };

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
            setTags(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Pagination error:", error);
        }
    }, [select, conditions, keyword, searchColumns, orderBy, perPage, currentPage]);

    useEffect(() => {
        paginate();
    }, [paginate]);

    const handleCreateTag = async (tagInput: Omit<TagInput, "id">) => {
        const payload: ITag = {
            name: tagInput.name,
        };

        const response = await create(payload);

        if (response) {
            dispatch(
                setToast({
                    message: "Add new tag successfully",
                    type: "success",
                })
            );
            paginate();
        }
    };

    const handleEditTag = async (tagInput: Omit<TagInput, "id">) => {
        if (!selectedTag || !selectedTag.tag_id) {
            console.error("No selected tag or tag_id is missing");
            return;
        }

        const payload: ITag = {
            tag_id: selectedTag.tag_id,
            name: tagInput.name,
        };

        console.log("Edit Payload:", payload);

        const response = await update(selectedTag.tag_id, payload);

        if (response) {
            dispatch(
                setToast({
                    message: "Tag updated successfully",
                    type: "success",
                })
            );
            paginate();
            closeEditModal();
        }
    };

    const handleDeleteTag = async (tagId: number | undefined) => {
        if (!tagId) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this tag?");
        if (!confirmDelete) return;

        try {
            const response = await deleteTag(tagId);

            if (response.success) {
                dispatch(
                    setToast({
                        message: "Tag deleted successfully",
                        type: "success",
                    })
                );
                paginate(); // Refresh the table after successful deletion
            } else {
                dispatch(
                    setToast({
                        message: "Failed to delete tag",
                        type: "error",
                    })
                );
            }
        } catch (error) {
            console.error("Delete error:", error);
            dispatch(
                setToast({
                    message: "Failed to delete tag",
                    type: "error",
                })
            );
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-stone-500">Tags</h1>
                <BasicButton content="create new tag" onClick={openCreateModal} />
            </div>
            <BasicModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onCreate={handleCreateTag}
                title="CREATE NEW TAG"
                fields={[
                    {
                        label: "Name",
                        type: "text",
                        key: "name",
                        defaultValue: "",
                    },
                ]}
            />
            <BasicModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onCreate={handleEditTag}
                title="EDIT TAG"
                fields={[
                    {
                        label: "Name",
                        type: "text",
                        key: "name",
                        defaultValue: selectedTag?.name || "",
                    },
                ]}
            />
            <div className="mb-10">
                <div className="flex space-x-4 border border-gray-200 rounded px-4 h-14 items-center bg-white shadow-md">
                    <div className="text-violet-500 uppercase">filter</div>
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
                        <th className="px-4 h-14 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag) => (
                        <tr key={tag.tag_id} className="border-b hover:bg-gray-50">
                            <td className="px-4 text-left">
                                <Checkbox id={`terms${tag.tag_id}`} />
                            </td>
                            <td className="px-4 h-14 flex items-center justify-start">
                                {tag.name}
                            </td>
                            <td className="p-3 text-left space-x-2">
                                <button
                                    onClick={() => openEditModal(tag)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTag(tag.tag_id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="h-5 w-5" />
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

export default Tags;
