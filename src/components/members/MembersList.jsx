'use client'
import formatDate from "@/utils/formatDate.mjs";
import Link from "next/link";
import { useMemo } from "react";
import Edit from "../svg/Edit";

const MembersList = ({ m = [] }) => {
    const memorizedMembers = useMemo(() => m, [m])
    return (
        <div className="space-y-6">
            {memorizedMembers.map((member) => (
                <div
                    key={member._id}
                    className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {member.name}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {member.village}, {member.post}, {member.policeStation}, {member.district}
                            </p>
                        </div>
                        <button
                        >
                            <Link href={`/members/new?id=${member?._id}`}><Edit /> </Link>
                        </button>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <p>
                            <span className="font-medium">পিতা:</span> {member?.father}
                        </p>
                        <p>
                            <span className="font-medium">মাতা:</span> {member?.mother}
                        </p>
                        <p>
                            <span className="font-medium">মোবাইল:</span> {member?.mobileNumber}
                        </p>
                        <p>
                            <span className="font-medium">ই-মেইল:</span> {member?.email}
                        </p>
                        <p>
                            <span className="font-medium">জাতীয় পরিচয়পত্র:</span> {member?.nationalId}
                        </p>
                        <p>
                            <span className="font-medium">গ্রাম:</span> {member?.village}
                        </p>
                    </div>

                    {/* Summary Section */}
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                            বিবরণ
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <p className="text-sm">
                                <span className="font-medium">মোট ব্যবসায় বিনিয়োগ:</span> {member?.projectCount}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">মোট বিনিয়োগ:</span> ৳{member?.totalAmountInvested.toLocaleString()}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">মোট লাভ পাবেন:</span> ৳{member?.totalWillGetAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                            {member?.projectsInfo?.length > 0 && 'ব্যবসার বর্ণনাঃ'}
                        </h3>
                        <div className="space-y-4">
                            {member?.projectsInfo?.map((project) => (
                                <div
                                    key={project?._id}
                                    className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700"
                                >
                                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                                        {project.projectName}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {project.projectType === "mudaraba"
                                            ? "মুদারাবা"
                                            : "বাইয়ে মুয়াজ্জাল"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">ইনভেস্ট করেছেনঃ </span> ৳{project.members[0].amountInvested.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">পাবেনঃ </span> ৳{project.members[0].willGetAmount.toLocaleString()} (
                                        {project.members[0].willGetPercentage}%)
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">মেয়াদ উত্তীর্ণের তারিখঃ </span> {formatDate(project.expiryDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MembersList;
