import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Confirmation
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded"
                    >
                        নিশ্চিত
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;