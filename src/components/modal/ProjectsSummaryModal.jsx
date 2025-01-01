import React, { useRef } from "react";
import calculateDurationInDays from "@/utils/calculateDurationInDays.mjs";
import formatDate from "@/utils/formatDate.mjs";
import getRemainingDays from "@/utils/getRemainingDays.mjs";
import Print from "../svg/Print";
import getProjectName from "@/utils/getProjectName.mjs";

const ProjectsSummaryModal = ({ projects, isOpen, onClose }) => {
    const printAreaRef = useRef(null);
    const iframeRef = useRef(null);

    if (!isOpen) return null;

    const handlePrint = () => {
        const iframe = iframeRef.current;
        const iframeDocument = iframe.contentWindow.document;

        const styles = `
            body { font-family: Arial, sans-serif; margin: 20px; background-color: white; }
            .text-lg { font-size: 1.125rem; font-weight: 600; }
            .font-semibold { font-weight: 600; }
            .text-gray-800 { color: #2d3748; }
            .text-gray-600 { color: #718096; }
            .single_project { margin-bottom: 100px; }
            .project_header {         page-break-inside: avoid; }
            table { width: 100%; border-collapse: collapse; }
               tr {
        page-break-inside: avoid;
    }
            th, td { padding: 8px; border: 0.1px solid #e2e8f0; text-align: left; }
        `;

        const content = printAreaRef.current.innerHTML;

        iframeDocument.open();
        iframeDocument.write(`<style>${styles}</style>${content}`);
        iframeDocument.close();

        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };

    return (
        <>
            <div
                className="modal-overlay fixed inset-0 text-black bg-black/20 backdrop-blur-sm"
                style={{ zIndex: 9999 }}
                // onClick={onClose}
            ></div>
            <div
                className="modal-content fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-custom1 overflow-y-auto"
                style={{
                    width: "90%",
                    maxWidth: "1000px",
                    maxHeight: "90vh",
                    zIndex: 10000,
                }}
            >
                <div className="flex justify-between items-center mb-2 px-10 py-4">
                    <button onClick={handlePrint} className="flex gap-2 text-black">
                        প্রিন্ট <Print />
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        বন্ধ করুন
                    </button>
                </div>

                <div ref={printAreaRef}>
                    {projects.map((project) => {
                        const remainingDays = getRemainingDays(project.expiryDate);
                        return <div key={project._id} className="p-6 single_project mb-6 bg-white rounded-lg shadow-md">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="project_header md:flex-row flex-col">
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
                                        <span style={{ fontWeight: '500' }}>স্থায়িত্বকালঃ </span>
                                        {calculateDurationInDays(project.startDate, project.expiryDate) + " দিন"}
                                    </p>
                                    <p style={{ marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: '500' }}>শুরুর তারিখঃ</span> {formatDate(project.startDate)}
                                    </p>
                                    <p>
                                        <span style={{ fontWeight: '500' }}>মেয়াদ উত্তীর্ণ</span> {formatDate(project.expiryDate)}
                                    </p>
                                </div>

                            </div>


                            {/* Members Table */}
                            <div className="mt-4 overflow-x-auto project_table">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-black">সদস্যঃ</h3>
                                <table className="w-full mt-2 border-collapse">
                                    <thead>
                                        <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                                            <th className="px-4 py-2 min-w-[60px] font-medium text-gray-600 dark:text-black">ক্রমিক</th>
                                            <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">নাম</th>
                                            <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">বিনিয়োগ</th>
                                            <th className="px-4 py-2 min-w-[160px] font-medium text-gray-600 dark:text-black">পেয়েছেন</th>
                                            <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">বাকি আছে</th>
                                            <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">মোট পাবেন</th>
                                            <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-black">
                                                {project.projectType === "mudaraba" ? "লাভ/লস পাবেন" : "লাভ পাবেন"}
                                            </th>
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
                                                        &#2547;{member.willGetAmount.toLocaleString()}
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
                    })}
                </div>
            </div>

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

export default ProjectsSummaryModal;
