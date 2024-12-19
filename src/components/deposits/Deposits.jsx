'use client'

import formatDate from "@/utils/formatDate.mjs";
import { useEffect, useState } from "react";
import { Flip, toast, ToastContainer } from "react-toastify";

const Deposits = ({ d }) => {
    const [deposits, setDeposits] = useState(d);
    useEffect(() => {
        setDeposits(d)
    }, [d])
    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure to delete this?");
        if (!confirm) return;

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
        <div className="py-6 px-4 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Deposit Records</h2>
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
                                ডেপোজিটের তারিখঃ {formatDate(deposit.depositDate)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                হিসাব উঠানো হয়েছেঃ {formatDate(deposit.addedOn)}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(deposit._id)}
                            className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <ToastContainer transition={Flip} />
        </div>
    );
};

export default Deposits;
