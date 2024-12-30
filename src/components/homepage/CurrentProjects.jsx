'use client';

import { useState } from 'react';
import { ToastContainer, Flip } from "react-toastify";
import ProjectDetailsModal from "../projects/ProjectDetailsModal";
import getProjectName from '@/utils/getProjectName.mjs';
import formatDate from '@/utils/formatDate.mjs';
import getRemainingDays from '@/utils/getRemainingDays.mjs';

const CurrentProjects = ({ p }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    console.log(p)
    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedProject(null);
    };

    const toggleAccordion = (projectId) => {
        setExpandedProjectId(prevId => prevId === projectId ? null : projectId);
    };

    const openProjectModal = (project) => {
        setSelectedProject(project);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="p-6 font-sans">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                চলমান ব্যবসা ({p.length})
            </h2>
            <div className="mt-4 space-y-4">
                {p.map((project) => {
                    const remainingDays = getRemainingDays(project.expiryDate);
                    // const totalPaid = project?.member?.payments?.reduce((sum, payment) => sum + payment.amount, 0);
                    // const unpaidAmount = project?.member?.willGetAmount - totalPaid;
                    return (<div
                        key={project._id}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                    >
                        <div
                            onClick={() => toggleAccordion(project._id)}
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {project.projectName}                                 <span
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
                            </span>
                            {/* <span>{totalPaid} {unpaidAmount}</span> */}
                            <span className="text-gray-500 dark:text-gray-400">
                                {expandedProjectId === project._id ? '-' : '+'}
                            </span>
                        </div>
                        {expandedProjectId === project._id && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">মোট টাকা:</span> {project.totalAmount} টাকা
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">শেষ তারিখ:</span>{' '}
                                    {formatDate(project.expiryDate)}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">প্রকল্পের ধরন:</span> {getProjectName(project.projectType)}
                                </p>
                                <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    সদস্য
                                </h4>
                                <div className="space-y-2">
                                    {/* {project.members.map((member) => (
                                        <div
                                            key={member.memberId}
                                            className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                                        >
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">নাম:</span> {member.name}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">বিনিয়োগ:</span> {member.amountInvested} টাকা
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">লাভের হার:</span> {member.willGetPercentage}%
                                            </p>
                                        </div>
                                    ))} */}
                                    {project.members.map((member) => {
                                        const totalPaid = member.payments.reduce((sum, payment) => sum + payment.amount, 0);
                                        const unpaidAmount = member.willGetAmount + member.amountInvested - totalPaid;
                                        return (
                                            <div
                                                key={member.memberId}
                                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                                            >
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">নাম:</span> {member.name}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">বিনিয়োগ:</span> {member.amountInvested} টাকা
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">লাভের হার:</span> {member.willGetPercentage}%
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">মোট পাবেন:</span> {member.willGetAmount + member.amountInvested} টাকা
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">পরিশোধিত:</span> {totalPaid} টাকা
                                                </p>
                                                <p className={`text-gray-700 dark:text-gray-300 ${unpaidAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                    <span className="font-semibold"></span> {unpaidAmount > 0 ? `${unpaidAmount} টাকা বাকি` : 'পরিশোধিত'}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => openProjectModal(project)}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                >
                                    বিস্তারিত দেখুন
                                </button>
                            </div>
                        )}
                    </div>)
                })}
            </div>
            {selectedProject && (
                <ProjectDetailsModal
                    showPaymentOption={true}
                    isOpen={isDetailsModalOpen}
                    onClose={closeDetailsModal}
                    project={selectedProject}
                />
            )}
            <ToastContainer transition={Flip} />
        </div>
    );
};

export default CurrentProjects;
