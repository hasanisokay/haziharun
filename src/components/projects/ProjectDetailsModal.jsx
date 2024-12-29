import React, { useRef, useState } from "react";
import calculateDurationInDays from "@/utils/calculateDurationInDays.mjs";
import formatDate from "@/utils/formatDate.mjs";
import getProjectName from "@/utils/getProjectName.mjs";
import getRemainingDays from "@/utils/getRemainingDays.mjs";
import PaymentModal from "../modal/PaymentModal";
import { toast } from "react-toastify";
import Print from "../svg/Print";

const ProjectDetailsModal = ({ project, isOpen, onClose, showPaymentOption }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMembers, setModalMembers] = useState([]);
    const [modalProjectId, setModalProjectId] = useState(null);
    const [loading, setLoading] = useState(false);
    const printAreaRef = useRef(null); // Reference for the printable area
    const iframeRef = useRef(null); // Reference for the iframe

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMembers([]);
        setModalProjectId(null);
    };

    const handlePaymentSubmit = async (memberId, a, date) => {
        let amount = parseFloat(a);
        if (amount < 0 || amount === 0 || loading) return;

        try {
            const res = await fetch("/api/puts/make-payment", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: modalProjectId,
                    memberId,
                    amount,
                    paymentDate: date,
                }),
            });
            const data = await res.json();
            if (data.status === 200) {
                toast.success(`${data?.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                onClose();
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
            setLoading(false);
        }
    };

    const openModal = (members, projectId) => {
        setModalMembers(members);
        setModalProjectId(projectId);
        setIsModalOpen(true);
    };

    const remainingDays = getRemainingDays(project.expiryDate);

    if (!isOpen) return null;

    // Handle the print functionality
    const handlePrint = () => {
        const iframe = iframeRef.current;
        const iframeDocument = iframe.contentWindow.document;

        // Inline CSS for the printed content
        const styles = `
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 0;
        background-color: white;
      }
      .modal-content {
        padding: 20px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
        overflow-y: auto;
      }
      .text-lg { font-size: 1.125rem; font-weight: 600; }
      .font-semibold { font-weight: 600; }
      .text-gray-800 { color: #2d3748; }
      .text-gray-600 { color: #718096; }
      .text-sm { font-size: 0.875rem; }
      .mt-4 { margin-top: 1rem; }
      .mb-4 { margin-bottom: 1rem; }
      .border-b { border-bottom: 1px solid #e2e8f0; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 8px; border: 1px solid #e2e8f0; text-align: left; }
    `;

        const content = printAreaRef.current.innerHTML; // Grab the content inside the ref

        iframeDocument.open();
        iframeDocument.write(`<style>${styles}</style>${content}`);
        iframeDocument.close();

        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };

    return (
        <>
            <div
                className="modal-overlay"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                }}
                onClick={onClose}
            ></div>

            <div
                className="modal-content"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "80%",
                    maxWidth: "800px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 10000,
                    overflowY: "auto", // Ensure the modal content is scrollable
                    maxHeight: "90vh", // Ensure the modal doesn't overflow vertically
                }}
            >
                <div key={project._id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-custom1">
                    {/* Top buttons */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handlePrint}
                            className="flex gap-2"
                        >
                            প্রিন্ট       <Print />
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            বন্ধ করুন
                        </button>
                    </div>

                    {/* Printable area */}
                    <div ref={printAreaRef}>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    {project.projectName}
                                </h2>
                                <span
                                    className={`text-sm mt-2 ${remainingDays <= 0
                                        ? "text-red-500"
                                        : remainingDays <= 7
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                        }`}
                                >
                                    {remainingDays > 0
                                        ? `মেয়াদ উত্তীর্ণের বাকি ${remainingDays} দিন`
                                        : `মেয়াদ উত্তীর্ণ হয়েছে ${remainingDays * -1} দিন আগে`}
                                </span>
                                {showPaymentOption && (
                                    <button
                                        onClick={() => openModal(project.members, project._id)}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        পেমেন্ট দিন
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>
                                <span className="font-medium">মোটঃ</span> ৳
                                {project.totalAmount.toLocaleString()}
                            </p>
                            <p>
                                <span className="font-medium max-w-[200px] whitespace-pre">বর্ণনাঃ</span> {project.note || "N/A"}
                            </p>
                            <p>
                                <span className="font-medium">স্থায়িত্বকালঃ </span> {calculateDurationInDays(project.startDate, project.expiryDate) + " দিন"}
                            </p>
                            <p>
                                <span className="font-medium">শুরুর তারিখঃ</span> {formatDate(project.startDate)}
                            </p>
                            <p>
                                <span className="font-medium">মেয়াদ উত্তীর্ণের তারিখঃ</span> {formatDate(project.expiryDate)}
                            </p>
                        </div>
                        {/* Members Table */}
                        <div className="mt-4 overflow-x-auto">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">সদস্যঃ</h3>
                            <table className="w-full mt-2 border-collapse">
                                <thead>
                                    <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                                        <th className="px-4 py-2 min-w-[60px] font-medium text-gray-600 dark:text-gray-400">ক্রমিক</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">নাম</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">বিনিয়োগ</th>
                                        <th className="px-4 py-2 min-w-[160px] font-medium text-gray-600 dark:text-gray-400">পেয়েছেন</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">বাকি আছে</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">মোট পাবেন</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                                            {project.projectType === "mudaraba" ? "লাভ/লস পাবেন" : "লাভ পাবেন"}
                                        </th>
                                        {project.projectType === "mudaraba" && (
                                            <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                                                পার্সেন্টেজ
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.members.map((member, index) => {
                                        let totalPaid = member?.payments
                                            ? member.payments.reduce((acc, currentV) => acc + currentV?.amount, 0)
                                            : 0;
                                        return (
                                            <tr key={member.memberId} className="border-b border-gray-300 dark:border-gray-600">
                                                {/* Serial Number */}
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td> {/* Serial number */}

                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{member.name}</td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                                    ৳{member.amountInvested.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                                    {member?.payments ? (
                                                        <div>
                                                            {member?.payments?.map((p, index) => (
                                                                <div key={index}>
                                                                    <p>{formatDate(p.date)} তারিখে ৳{p.amount.toLocaleString()}</p>
                                                                </div>
                                                            ))}
                                                            {totalPaid > 0 ? (
                                                                <p className="py-1 font-semibold">
                                                                    মোটঃ <span className="font-semibold">৳{totalPaid.toLocaleString()}</span>
                                                                </p>
                                                            ) : (
                                                                <p>0</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p>0</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                                    ৳{(member.amountInvested + member.willGetAmount - totalPaid).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                                    {project.projectType === "mudaraba" ? (
                                                        <p>
                                                            ৳{member.amountInvested.toLocaleString()} ±{" "}
                                                            {member.willGetAmount.toLocaleString()}
                                                        </p>
                                                    ) : (
                                                        <p>৳{(member.amountInvested + member.willGetAmount).toLocaleString()}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                                    ৳{member.willGetAmount.toLocaleString()}
                                                </td>
                                                {project.projectType === "mudaraba" && (
                                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                                        {member.willGetPercentage}%
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                <PaymentModal isOpen={isModalOpen} onClose={closeModal} members={modalMembers} onSubmit={handlePaymentSubmit} />
            </div>

            {/* Hidden iframe for printing */}
            <iframe
                ref={iframeRef}
                style={{
                    position: "absolute",
                    width: "0",
                    height: "0",
                    border: "none",
                    visibility: "hidden",
                }}
            ></iframe>
        </>
    );
};

export default ProjectDetailsModal;
