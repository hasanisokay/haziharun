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
                window.location.reload();
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
        const content = printAreaRef.current.innerHTML; // Grab the content inside the ref
    
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
    
        // Open a new window for the print content
        const printWindow = window.open('', '_blank', 'width=800,height=600');
    
        // Write the styles and content into the print window
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <style>${styles}</style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
    
        // Wait for the document to load and then print
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        //   printWindow.close();
        };
    };
    

    return (
        <>
            <div
                className={`modal-overlay ${isOpen ? 'opacity-1 visible' : 'invisible opacity-0'} inset-0 bg-black/20 backdrop-blur-sm`}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    zIndex: 9999,
                }}
                onClick={onClose}
            ></div>

            <div
                className="modal-content text-black"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff",
                    // padding: "20px",
                    borderRadius: "8px",
                    width: "80%",
                    maxWidth: "800px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 10000,
                    overflowY: "auto", // Ensure the modal content is scrollable
                    maxHeight: "90vh", // Ensure the modal doesn't overflow vertically
                }}
            >
                <div key={project._id} className="p-6 bg-white  rounded-lg shadow-custom1">
                    {/* Top buttons */}
                    <div className="flex justify-between items-center mb-2">
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
                    <div className="mb-2">
                        {showPaymentOption && (
                            <button
                                onClick={() => openModal(project.members, project._id)}
                                className="bg-blue-500 my-2 text-white px-4 py-1 text-sm rounded-lg"
                            >
                                পেমেন্ট দিন
                            </button>
                        )}
                    </div>

                    {/* Printable area */}
                    <div ref={printAreaRef}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="md:flex-row flex-col">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-gray-800 ">
                                    {project.projectName}
                                </h2>

                                <p
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
                                </p>
                                <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                                    <p style={{ marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: '500' }}>মোটঃ</span> &#2547;
                                        {project.totalAmount.toLocaleString()}
                                    </p>
                                    <p style={{ marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: '500', maxWidth: '200px', whiteSpace: 'pre' }}>বর্ণনাঃ</span> {project.note || "N/A"}
                                    </p>

                                </div>

                            </div>
                            <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#4B5563' }}>
                                <p style={{ marginBottom: '0.25rem' }}>{getProjectName(project.projectType)}</p>

                             
                                <p style={{ marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: '500' }}>শুরু হয়েছেঃ</span> {formatDate(project.startDate)}
                                </p>
                                <p>
                                    <span style={{ fontWeight: '500' }}>{new Date(project.expiryDate) < new Date() ? 'শেষ হয়েছেঃ' : 'শেষ হবেঃ'}</span> {formatDate(project.expiryDate)}
                                </p>
                                <p style={{ marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: '500' }}>স্থায়ীত্বকালঃ </span>
                                    {calculateDurationInDays(project.startDate, project.expiryDate) + " দিন"}
                                </p>
                            </div>

                        </div>


                        {/* Members Table */}
                        <div className="mt-4 overflow-x-auto">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-black">সদস্যঃ</h3>
                            <table className="w-full mt-2 border-collapse">
                                <thead>
                                    <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                                        <th className="px-4 py-2 min-w-[60px] font-medium text-gray-600 dark:text-black">ক্রমিক</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">নাম</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">বিনিয়োগ</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">
                                            {project.projectType === "mudaraba" ? "লাভ/লস পাবেন" : "লাভ পাবেন"}
                                        </th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">মোট পাবেন</th>
                                        <th className="px-4 py-2 min-w-[160px] font-medium text-gray-600 dark:text-black">পেয়েছেন</th>
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">বাকি আছে</th>
                                  
                                      
                                        <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">
                                            পার্সেন্টেজ
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {project.members.map((member, index) => {
                                        let totalPaid = member?.payments
                                            ? member.payments.reduce((acc, currentV) => acc + currentV?.amount, 0)
                                            : 0;
                                        return (
                                            <tr key={member.memberId} className="border-b border-gray-300 dark:border-gray-600">
                                                <td className="px-4 py-2 text-gray-700 dark:text-black">{index + 1}</td>

                                                <td className="px-4 py-2 text-gray-700 dark:text-black">{member.name}</td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-black">
                                                    &#2547;{member.amountInvested.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-black">
                                                    &#2547;{member.willGetAmount.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-black">
                                                    {project.projectType === "mudaraba" ? (
                                                        <p>
                                                            &#2547;{member.amountInvested.toLocaleString()} ±{" "}
                                                            {member.willGetAmount.toLocaleString()}
                                                        </p>
                                                    ) : (
                                                        <p>&#2547;{(member.amountInvested + member.willGetAmount).toLocaleString()}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-black">
                                                    {member?.payments ? (
                                                        <div>
                                                            {member?.payments?.map((p, index) => (
                                                                <div key={index}>
                                                                    <p>{formatDate(p.date)} তারিখে &#2547;{p.amount.toLocaleString()}</p>
                                                                </div>
                                                            ))}
                                                            {totalPaid > 0 ? (
                                                                <p className="py-1 font-semibold">
                                                                    মোটঃ <span className="font-semibold">&#2547;{totalPaid.toLocaleString()}</span>
                                                                </p>
                                                            ) : (
                                                                <p>0</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p>0</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-black">
                                                    &#2547;{(member.amountInvested + member.willGetAmount - totalPaid).toLocaleString()}
                                                </td>
                                         
                                             

                                                <td className="px-4 py-2 text-gray-700 dark:text-black">
                                                    {member.willGetPercentage}%
                                                </td>

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
