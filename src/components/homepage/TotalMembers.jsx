'use client';

import { useEffect, useState } from "react";
import Up from "../svg/Up";
import Down from "../svg/Down";
import { useRouter } from "next/navigation";

const TotalMembers = () => {
    const [membersList, setMembersList] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/gets/members-with-amount-to-get');
            const data = await res.json();
            if (data.status === 200) {
                setMembersList(data?.data?.members);
            } else {
                console.error("Server error while fetching members");
            }
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const permanentCount = membersList?.filter(member => member.type === "permanent")?.length;
    const temporaryCount = membersList?.filter(member => member.type === "temporary")?.length;

    return (
        <div className="p-6">
            {/* Header Section */}
            <h2
                onClick={toggleExpand}
                className="text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer flex items-center"
            >
                মোট সদস্য: {membersList.length}{" "}
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    (স্থায়ী: {permanentCount}, অস্থায়ী: {temporaryCount})
                </span>
                <button className="ml-2">
                    {!isExpanded ? <Up /> : <Down />}
                </button>
            </h2>

            {/* Expanded Members Section */}
            {isExpanded && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {membersList?.map((member) => (
                        <div
                            key={member._id}
                            className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 space-y-2"
                        >
                            {/* Member Name */}
                            <p  onClick={() => router.push(`/members`)} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {member.name} ({member.type === "permanent" ? "স্থায়ী" : "অস্থায়ী"})
                            </p>

                            {/* Basic Info */}
                            <div className="text-gray-700 dark:text-gray-300 space-y-1">
                                <p>গ্রাম: {member.village || 'নেই'}</p>
                                <p>জেলা: {member.district || 'নেই'}</p>
                                <p>মোবাইল: {member.mobileNumber || 'নেই'}</p>
                                <p>ইমেইল: {member.email || 'নেই'}</p>
                                <p>জাতীয় পরিচয়পত্র: {member.nationalId || 'নেই'}</p>
                            </div>

                            {/* Financial Info */}
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p>মোট বিনিয়োগ: <span className="font-medium text-gray-900 dark:text-gray-100">{member.totalInvested} টাকা</span></p>
                                <p>বিনিয়োগ থেকে মোট লাভ: <span className="font-medium text-gray-900 dark:text-gray-100">{member.totalExpected} টাকা</span></p>
                                <p>পেয়েছেন: <span className="font-medium text-gray-900 dark:text-gray-100">{member.totalReceived} টাকা</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TotalMembers;
