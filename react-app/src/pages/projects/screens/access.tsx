import React from "react";

interface User {
    name: string;
    billableRate: string;
    role: string;
}

// Dữ liệu fake tĩnh
const fakeData = {
    visibility: "Public" as "Private" | "Public",
    users: [
        { name: "Vungocu12a3", billableRate: "-", role: "Owner" },
        { name: "Vungocu9a9dt", billableRate: "-", role: "-" },
    ],
};

const Access: React.FC = () => {
    // Hàm giả lập thay đổi visibility (chỉ để demo)
    const handleChangeVisibility = (visibility: "Private" | "Public") => {
        console.log(`Visibility changed to: ${visibility}`);
        // Ở đây bạn có thể cập nhật state nếu cần, nhưng vì không dùng props, ta chỉ log để demo
    };

    // Hàm giả lập thay đổi tỷ lệ (chỉ để demo)
    const handleChangeRate = (name: string, rate: string) => {
        console.log(`Rate changed for ${name} to ${rate}`);
        // Ở đây bạn có thể cập nhật dữ liệu fake nếu cần
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            {/* Visibility Section */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Visibility</h2>
                <p className="text-gray-500 text-sm mb-2">
                    Everyone can track time on public projects.
                </p>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="visibility"
                            checked={fakeData.visibility === "Private"}
                            onChange={() => handleChangeVisibility("Private")}
                            className="mr-2"
                        />
                        Private
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="visibility"
                            checked={fakeData.visibility === "Public"}
                            onChange={() => handleChangeVisibility("Public")}
                            className="mr-2"
                        />
                        Public
                    </label>
                </div>
            </div>

            {/* Add Members Button */}
            <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                + Add members
            </button>

            {/* Users Table */}
            <div className="overflow-x-auto mb-4">
                <h2 className="text-lg font-semibold mb-2">Users</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="p-2 border-b">Users</th>
                            <th className="p-2 border-b">
                                Billable Rate (USD)
                            </th>
                            <th className="p-2 border-b">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakeData.users.map((user, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {user.billableRate}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleChangeRate(
                                                    user.name,
                                                    "100"
                                                )
                                            }
                                            className="text-blue-500 hover:underline"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </td>
                                <td className="p-2">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Groups Section (Placeholder) */}
            <div className="overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">Groups</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="p-2 border-b">Users</th>
                            <th className="p-2 border-b">
                                Billable Rate (USD)
                            </th>
                            <th className="p-2 border-b">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakeData.users.map((user, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {user.billableRate}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleChangeRate(
                                                    user.name,
                                                    "100"
                                                )
                                            }
                                            className="text-blue-500 hover:underline"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </td>
                                <td className="p-2">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Access;
