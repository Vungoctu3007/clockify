import React, { useState } from 'react';


const Team: React.FC = () => {
  // State cho bộ lọc
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showActive, setShowActive] = useState<boolean>(true);

  // Tab hiện tại
  const [activeTab, setActiveTab] = useState<string>('TASKS');

  const tabs = ['TASKS', 'ACCESS', 'NOTE'];

  // Dữ liệu mẫu cho tasks (chỉ cần nếu Tab TASKS sử dụng)
  const [tasks, setTasks] = useState<{ name: string; assignees: string }[]>([
    { name: 'sadf', assignees: 'Anyone' },
  ]);

  // Hàm xử lý tìm kiếm (placeholder)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Hàm thêm task mới (chỉ cần nếu Tab TASKS sử dụng)
  const handleAddTask = () => {
    const newTask = { name: '', assignees: 'Anyone' };
    setTasks([...tasks, newTask]);
  };

  // Chọn component dựa trên tab
  const renderTabContent = () => {
    switch (activeTab) {
    //   case 'TASKS':
    //     return (
    //       <Task/>
    //     );
    //   case 'ACCESS':
    //     return <Access />;
    //   case 'NOTE':
    //     return <Note />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Tiêu đề và breadcrumbs */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <nav className="text-sm text-blue-500">
            <a href="#" className="hover:underline">Projects</a> / Algorithm
          </nav>
          <h1 className="text-2xl font-bold">Algorithm</h1>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nội dung của tab */}
      {renderTabContent()}
    </div>
  );
};

export default Team;
