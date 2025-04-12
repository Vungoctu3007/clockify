import React, { useState, useEffect } from 'react';
import BasicButton from './basicButton';
import BasicSelect from './basicSelect';
import BasicInput from './input';

interface ModalData {
  name: string;
  [key: string]: any;
}

interface ModalProps<T extends ModalData> {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Omit<T, 'id'>) => void;
  title: string;
  fields: {
    label: string;
    type: 'text' | 'select' | 'datetime' | 'color';
    key: keyof T;
    options?: string[];
    defaultValue?: any; 
  }[];
}

const BasicModal = <T extends ModalData>({
  isOpen,
  onClose,
  onCreate,
  title,
  fields,
}: ModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>({});

  useEffect(() => {
    if (isOpen) {
      const initialData: Partial<T> = {};
      fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.key] = field.defaultValue;
        }
      });
      setFormData(initialData);
    }
  }, [isOpen, fields]);

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreate = () => {
    console.log('Form Data:', formData); // Debug payload
    if (!formData.name) {
      alert('Name is required');
      return;
    }

    onCreate(formData as Omit<T, 'id'>);
    setFormData({});
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
      <div
        id="default-modal"
        aria-hidden={!isOpen}
        className={`${isOpen ? 'flex' : 'hidden'} overflow-y-auto fixed inset-0 z-50 justify-center items-center`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-medium">{title}</h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-900">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {fields.map((field) => (
                <div key={String(field.key)} className="flex flex-col">
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  {field.type === 'text' && (
                    <BasicInput
                      type="text"
                      placeholder={`Enter ${field.label}`}
                      value={(formData[field.key] as string) || field.defaultValue || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                  {field.type === 'select' && field.options && (
                    <BasicSelect
                      options={field.options}
                      value={(formData[field.key] as string) || field.defaultValue || field.options[0]}
                      onChange={(value) => handleChange(field.key, value)}
                    />
                  )}
                  {field.type === 'datetime' && (
                    <BasicInput
                      type="datetime-local"
                      value={(formData[field.key] as string) || field.defaultValue || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                  {field.type === 'color' && (
                    <input
                      type="color"
                      value={(formData[field.key] as string) || field.defaultValue || '#007BFF'}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full h-10 rounded-md border-gray-300"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end p-4 border-t">
              <BasicButton
                content="Cancel"
                onClick={handleClose}
                className="mr-3 bg-red-600 text-white"
              />
              <BasicButton
                content={title}
                onClick={handleCreate}
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
