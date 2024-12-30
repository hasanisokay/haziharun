'use client'

import formatDate from "@/utils/formatDate.mjs";
import { useEffect, useState } from "react";
import { Flip, toast, ToastContainer } from "react-toastify";
import DateRangePicker from "../selects/DateRangePicker";
import LimitSelect from "../selects/LimitSelect";
import ConfirmModal from "../modal/ConfirmModal";

const Deposits = ({ d, limit }) => {
    const [deposits, setDeposits] = useState(d);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [depositToDelete, setDepositToDelete] = useState(null);

    useEffect(() => {
        setDeposits(d)
    }, [d])
    const handleDeleteClick = (id) => {
        setDepositToDelete(id);
        setIsConfirmModalOpen(true);
      };
    
      const confirmDelete = () => {
        if (depositToDelete) {
          handleDelete(depositToDelete);
          setIsConfirmModalOpen(false);
          setDepositToDelete(null);
        }
      };

    const handleDelete = async (id) => {
        const res = await fetch("/api/deletes/deposit", {
            method: "DELETE",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
        const data = await res.json();
        if (data.status === 200) {
            toast.success(data.message);
            setDeposits((prev) => prev.filter(d => d._id !== id));
        } else {
            toast.error(data.message)
        }
    };

    return (
        <div className="py-6 px-4 bg-gray-50 dark:bg-gray-900 ">
            <LimitSelect limit={limit} />
            <DateRangePicker endDateParam={'end_date'} startDateParam={'start_date'} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">আমানত রেকর্ড</h2>
            <div className="space-y-4">
                {deposits?.map((deposit) => (
                    <div key={deposit._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {deposit.member.name}
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="text-xl font-medium text-green-600 dark:text-green-400">
                                ৳ {deposit.amount.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                আমানতের তারিখঃ {formatDate(deposit.depositDate)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                হিসাব উঠানো হয়েছেঃ {formatDate(deposit.addedOn)}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDeleteClick(deposit._id)}
                            className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                // message="Are you sure you want to delete this project? This action cannot be undone."
                message={'আপনি কি নিশ্চিত যে আপনি এই এন্ট্রি ডিলিট করতে চান? ডিলিট করার পর এটা পুনরুদ্ধার করা যাবে না।'}
            />
            <ToastContainer transition={Flip} />
        </div>
    );
};

export default Deposits;
