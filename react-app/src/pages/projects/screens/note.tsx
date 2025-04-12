import React, { useState } from 'react';

// Dữ liệu fake ban đầu
const fakeNotes: string[] = [];

const Note: React.FC = () => {
  const [notes, setNotes] = useState<string[]>(fakeNotes);
  const [currentNote, setCurrentNote] = useState<string>('');

  // Hàm xử lý khi nhập ghi chú
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
  };

  // Hàm xử lý khi nhấn Enter để lưu ghi chú
  const handleNoteSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && currentNote.trim() !== '') {
      setNotes([...notes, currentNote]);
      setCurrentNote(''); // Xóa textarea sau khi lưu
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Textarea để nhập ghi chú */}
      <div className="mb-4">
        <textarea
          value={currentNote}
          onChange={handleNoteChange}
          onKeyDown={handleNoteSubmit}
          placeholder="Add note..."
          className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Hiển thị danh sách ghi chú (nếu có) */}
      {notes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <ul className="list-disc list-inside">
            {notes.map((note, index) => (
              <li key={index} className="text-gray-700 mb-1">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Note;
