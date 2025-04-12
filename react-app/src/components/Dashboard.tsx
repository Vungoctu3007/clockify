import React, { useEffect, useState } from "react";
import { getAllTimeEntryByUserId } from "@/services/timeEntryService";
import { getAllProjectsByUserId } from "@/services/projectService";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Định nghĩa kiểu dữ liệu TimeEntry
interface TimeEntry {
  time_entry_id: number;
  title: string;
  start: string;
  end: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    description: string | null;
    project_id: number | null;
    task_id: number | null;
  };
}

// Định nghĩa kiểu dữ liệu Project
interface Project {
  id: number;
  name: string;
  user_id: number;
  tasks: { task_id: number; title: string }[];
  color: string;
}

// Hàm tính thời gian (giờ) từ start và end
const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  return durationMs / (1000 * 60 * 60); // Chuyển đổi từ milliseconds sang giờ
};

// Hàm định dạng thời gian (HH:MM:SS)
const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// Hàm lấy ngày trong tuần hoặc ngày, xử lý múi giờ UTC
const getDateRange = (range: "day" | "week" | "month") => {
  const today = new Date("2025-04-11T00:00:00Z"); // Đặt ngày hiện tại ở UTC
  let start: Date, end: Date;

  if (range === "day") {
    start = new Date(today);
    start.setUTCHours(0, 0, 0, 0); // Bắt đầu ngày ở UTC
    end = new Date(today);
    end.setUTCHours(23, 59, 59, 999); // Kết thúc ngày ở UTC
  } else if (range === "week") {
    const dayOfWeek = today.getUTCDay();
    start = new Date(today);
    start.setUTCDate(today.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Bắt đầu từ thứ Hai
    start.setUTCHours(0, 0, 0, 0);
    end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6); // Kết thúc vào Chủ Nhật
    end.setUTCHours(23, 59, 59, 999);
  } else {
    // Tháng
    start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    start.setUTCHours(0, 0, 0, 0);
    end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
    end.setUTCHours(23, 59, 59, 999);
  }

  return { start, end };
};

// Hàm lấy danh sách ngày trong khoảng thời gian, xử lý múi giờ UTC
const getDaysInRange = (start: Date, end: Date): Date[] => {
  const days: Date[] = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return days;
};

// Hàm tạo màu sắc từ project hoặc màu mặc định
const getProjectColor = (project: Project | undefined, index: number): string => {
  if (project && project.color) {
    // Nếu màu là dạng tên (như "green"), trả về trực tiếp
    if (["green", "red", "blue", "yellow", "purple"].includes(project.color)) {
      return project.color;
    }
    // Nếu màu là mã hex (như "#FF0000"), trả về mã hex
    if (project.color.startsWith("#")) {
      return project.color;
    }
  }
  // Mặc định nếu không có màu hợp lệ
  const defaultColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
  return defaultColors[index % defaultColors.length];
};

const DashboardComponent: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalTime, setTotalTime] = useState(0); // Tổng thời gian (giờ)
  const [dailyTimes, setDailyTimes] = useState<number[]>([]); // Thời gian mỗi ngày
  const [projectTimes, setProjectTimes] = useState<
    { projectId: number | null; name: string; time: number; color: string }[]
  >([]); // Thời gian theo dự án
  const [days, setDays] = useState<Date[]>([]); // Danh sách ngày trong khoảng thời gian
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week"); // Khoảng thời gian

  // Lấy dữ liệu time entries và projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timeEntriesResponse, projectsResponse] = await Promise.all([
          getAllTimeEntryByUserId(),
          getAllProjectsByUserId(),
        ]);
        setTimeEntries(timeEntriesResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Tính toán thống kê khi timeEntries hoặc timeRange thay đổi
  useEffect(() => {
    if (timeEntries.length === 0 || projects.length === 0) return;

    // Xác định khoảng thời gian
    const { start, end } = getDateRange(timeRange);
    const daysInRange = getDaysInRange(start, end);
    setDays(daysInRange);

    // Lọc các time entries trong khoảng thời gian, so sánh ở UTC
    const filteredEntries = timeEntries.filter((entry) => {
      const startTime = new Date(entry.start);
      // Chuyển startTime về UTC để so sánh
      const startTimeUTC = new Date(startTime.toISOString());
      return startTimeUTC >= start && startTimeUTC <= end;
    });

    // Tính tổng thời gian, thời gian mỗi ngày, và thời gian theo dự án
    let total = 0;
    const dailyTotals = new Array(daysInRange.length).fill(0);
    const projectTimeMap: { [key: string]: number } = {};

    filteredEntries.forEach((entry) => {
      const duration = calculateDuration(entry.start, entry.end);
      total += duration;

      // Tính thời gian mỗi ngày, so sánh ở UTC
      const startDate = new Date(entry.start);
      const startDateUTC = new Date(startDate.toISOString());
      const dayIndex = daysInRange.findIndex((day) => {
        return (
          day.getUTCDate() === startDateUTC.getUTCDate() &&
          day.getUTCMonth() === startDateUTC.getUTCMonth() &&
          day.getUTCFullYear() === startDateUTC.getUTCFullYear()
        );
      });
      if (dayIndex !== -1) {
        dailyTotals[dayIndex] += duration;
      }

      // Tính thời gian theo dự án
      const projectId = entry.extendedProps.project_id || "no-project";
      projectTimeMap[projectId] = (projectTimeMap[projectId] || 0) + duration;
    });

    // Tạo danh sách projectTimes với màu sắc
    const projectIds = Object.keys(projectTimeMap);
    const projectTimesArray = projectIds.map((projectId, index) => {
      const id = projectId === "no-project" ? null : parseInt(projectId);
      const project = projects.find((p) => p.id === id);
      return {
        projectId: id,
        name: id === null ? "No project" : project?.name || "Unknown Project",
        time: projectTimeMap[projectId],
        color: getProjectColor(project, index),
      };
    });

    setTotalTime(total);
    setDailyTimes(dailyTotals);
    setProjectTimes(projectTimesArray);
  }, [timeEntries, projects, timeRange]);

  // Định dạng ngày hiển thị
  const formatDayLabel = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[date.getUTCDay()]}, ${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
  };

  // Dữ liệu cho biểu đồ hình tròn
  const pieData = {
    labels: projectTimes.map((project) => project.name),
    datasets: [
      {
        data: projectTimes.map((project) => project.time),
        backgroundColor: projectTimes.map((project) => project.color),
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho biểu đồ hình tròn
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Time Distribution by Project",
      },
    },
  };

  // Dữ liệu cho biểu đồ cột
  const barData = {
    labels: days.map(formatDayLabel),
    datasets: [
      {
        label: "Time (hours)",
        data: dailyTimes,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho biểu đồ cột
  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Daily Working Time",
      },
    },
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select className="p-2 border rounded-lg text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500">
            <option>Team</option>
            <option>Team Member 1</option>
            <option>Team Member 2</option>
          </select>
          <select
            className="p-2 border rounded-lg text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as "day" | "week" | "month")}
          >
            <option value="day">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Tổng thời gian */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Time</h2>
          <p className="text-3xl font-bold text-gray-800">{formatDuration(totalTime)}</p>
        </div>

        {/* Biểu đồ hình tròn */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {projectTimes.length > 0 ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <p className="text-sm text-gray-500">No project data available.</p>
          )}
        </div>
      </div>

      {/* Biểu đồ cột */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Bảng chi tiết thời gian theo dự án */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Time by Project</h2>
        {projectTimes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left text-sm font-medium text-gray-600">Project</th>
                  <th className="border p-3 text-left text-sm font-medium text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {projectTimes.map((project) => (
                  <tr key={project.projectId || "no-project"} className="border-b hover:bg-gray-50">
                    <td className="border p-3 flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm text-gray-700">{project.name}</span>
                    </td>
                    <td className="border p-3 text-sm text-gray-700">{formatDuration(project.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No project data available.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
