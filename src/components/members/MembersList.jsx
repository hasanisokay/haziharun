'use client'
import formatDate from "@/utils/formatDate.mjs";
import Link from "next/link";
import { useMemo, useState } from "react";
import Edit from "../svg/Edit";
import DefaultSorting from "../selects/DefaultSoring";
import SearchBox from "../forms/SearchBox";
import Report from "../svg/Report";
import MemberReportModal from "./MemberReportModal";
import { Button } from "../ui/button";
import getMembersWithDetails from "@/utils/getMembersWithDetails.mjs";
import AllMemberReportModal from "./AllMemberReposrtModal";
import Delete from "../svg/Delete";
import ConfirmModal from "../modal/ConfirmModal";
import { Flip, toast, ToastContainer } from "react-toastify";
import convertToBanglaNumber from "@/utils/convertToBanglaNumber.mjs";
import calculateDurationInDays from "@/utils/calculateDurationInDays.mjs";

const MembersList = ({ m = [] }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [members, setMembers] = useState(m);
    const memorizedMembers = useMemo(() => members, [members]);

    const [allMembers, setAllMembers] = useState([]);
    const [loadingAllMembers, setLoadingAllMembers] = useState(false);
    const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);
    const [permanentMemberCount, setPermantMemberCount] = useState(0);
    const [temopraryMemberCount, setTemporaryMemberCount] = useState(0);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [memberIdToDelete, setMemberIdToDelete] = useState(null);

    const [totalDepositAmount, setTotalDepositAmount] = useState(0);

    const handleDeleteClick = (projectId) => {
        setMemberIdToDelete(projectId);
        setIsConfirmModalOpen(true);
    };
    const confirmDelete = () => {
        if (memberIdToDelete) {
            deleteMember(memberIdToDelete);
            setIsConfirmModalOpen(false);
            setMemberIdToDelete(null);
        }
    };
    const deleteMember = async (memberId) => {
        try {
            const res = await fetch("/api/deletes/delete-member", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: memberId }),
            });
            const data = await res.json();
            if (data?.status === 200) {
                setMembers((prevMembers) =>
                    prevMembers.filter((m) => m._id !== memberId)
                );
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 2000
                });
            } else {
                toast.error(data.message || data.error, {
                    position: "top-right",
                    autoClose: 2000
                });
            }
        } catch (error) {
            toast.error(error.message || "Error", {
                position: "top-right",
                autoClose: 2000
            });
        }
    }
    const handleAllMembersClick = async () => {
        setLoadingAllMembers(true)
        if (allMembers.length > 0) {
            setLoadingAllMembers(false)
            setIsAllProjectsModalOpen(true);
            return;
        }
        const d = await getMembersWithDetails(1, 999999999, "newest", '', '');
        if (d.status === 200) {
            setAllMembers(d?.data?.members);
            const totalDeposit = getTotalDepositAmount(d?.data?.members);
            setTotalDepositAmount(totalDeposit);
        }
        else {
            return;
        }
        const permanentMembers = d?.data?.members?.reduce((count, m) => {
            if (m.type === "permanent") {
                return count + 1;
            }
            return count;
        }, 0);

        setPermantMemberCount(permanentMembers || 0);
        setTemporaryMemberCount(d?.data?.members?.length - permanentMembers || 0);
        setLoadingAllMembers(false)
        setIsAllProjectsModalOpen(true);
    };
    function getTotalDepositAmount(data) {
        return data.reduce((total, person) => {
            if (person.depositsInfo && person.depositsInfo.length > 0) {
                const personTotal = person.depositsInfo.reduce((personSum, deposit) => personSum + deposit.amount, 0);
                return total + personTotal;
            }
            return total;
        }, 0);
    }

    const s = [
        { value: "permanent_members_only", label: "আমানতসহ সদস্য" },
        { value: "all", label: "সব সদস্য" },
        { value: "temporary_members_only", label: "আমানতহীন সদস্য" },
    ];
    const closeModal = () => setSelectedMember(null);
    console.log(memorizedMembers)
    return (
        <div className="mt-4">
            <div >
                <Button onClick={handleAllMembersClick} className="bg-blue-500 text-white">
                    {loadingAllMembers ? "লোড হচ্ছে..." : "সকল সদস্যের রিপোর্ট দেখুন"}
                </Button>
            </div>
            <SearchBox placeholder={'সদস্যের নাম, পিতা/মাতার নাম, মোবাইল নাম্বার ইত্যাদি দিয়ে সার্চ করুন'} />
            <DefaultSorting sortingOptionsProps={s} field="filter" />
            <div className="space-y-6">
                {memorizedMembers.map((member, index) => {
                    const totalDepositAmount = member?.depositsInfo?.length > 0 ? member?.depositsInfo?.reduce((total, item) => total + item.amount, 0) :0;
                    return <div
                        key={member._id}
                        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                    >
                        <span style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', textAlign: 'center', display: 'block' }}>সদস্য নং- {convertToBanglaNumber(index + 1)}</span>
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
                            <div className="flex gap-4">
                                <button onClick={() => setSelectedMember(member)}>
                                    <Report />
                                </button>
                                <button
                                >
                                    <Link href={`/members/new?id=${member?._id}`}><Edit /> </Link>
                                </button>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                <span className="font-medium"></span> {member?.type === "permanent" ? "আমানতসহ সদস্য" : "আমানতহীন সদস্য"}
                            </p>
                            <p>
                                <span className="font-medium">মোবাইল:</span> {member?.mobileNumber}
                            </p>
                            <p>
                                <span className="font-medium">পিতা:</span> {member?.father}
                            </p>
                            <p>
                                <span className="font-medium">মাতা:</span> {member?.mother}
                            </p>

                            <p>
                                <span className="font-medium">ই-মেইল:</span> {member?.email}
                            </p>
                            <p>
                                <span className="font-medium">জাতীয় পরিচয়পত্র:</span> {member?.nationalId}
                            </p>
                        </div>

                        {/* Summary Section */}
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                                বিবরণ
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <p className="text-sm">
                                    <span className="font-medium">মোট আমানতঃ</span> &#2547;{totalDepositAmount}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">মোট ব্যবসায় বিনিয়োগঃ</span> {member?.projectCount}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">বিনিয়োগের পরিমাণঃ</span> &#2547;{member?.totalAmountInvested?.toLocaleString()}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">লাভ পাবেনঃ</span> &#2547;{member?.totalWillGetAmount?.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Project Details Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                                {member?.projectsInfo?.length > 0 && 'ব্যবসার বর্ণনাঃ'}
                            </h3>
                            <div className="space-y-4">
                                {member?.projectsInfo?.map((project, index) => {
                                    const currentMember = project?.members?.filter(m => m.memberId === member._id)[0];
                                    const totalPaid = currentMember?.payments?.length > 0 ? currentMember?.payments?.reduce((sum, payment) => sum + payment?.amount, 0) : 0;
                                    return (<div
                                        key={project?._id}
                                        className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700"
                                    >
                                        <span style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>প্রকল্প নং- {convertToBanglaNumber(index + 1)}</span>

                                        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                                            {project.projectName}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {project.projectType === "mudaraba"
                                                ? "মুদারাবা"
                                                : "বাইয়ে মুয়াজ্জাল"}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">বিনিয়োগঃ </span> &#2547;{currentMember?.amountInvested?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">লাভঃ </span> &#2547;{currentMember?.willGetAmount?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">মোটঃ </span> &#2547; {(currentMember?.amountInvested + currentMember?.willGetAmount)?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">পেয়েছেনঃ </span> &#2547; {totalPaid?.toLocaleString()}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                                            <span style={{ fontWeight: '500' }}>বাকি আছেঃ </span> &#2547; {(currentMember?.willGetAmount + currentMember?.amountInvested - totalPaid)?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">পার্সেন্টেজঃ </span> &#2547; {currentMember?.willGetPercentage}%
                                        </p>

                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">শুরু হয়েছেঃ </span> {formatDate(project.startDate)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">{new Date(project.expiryDate) < new Date() ? 'শেষ হয়েছেঃ' : 'শেষ হবেঃ'}</span> {formatDate(project.expiryDate)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span >স্থায়ীত্বকালঃ </span>
                                            {calculateDurationInDays(project.startDate, project.expiryDate) + " দিন"}
                                        </p>
                                    </div>)
                                })}
                            </div>
                        </div>

                        <Button
                            onClick={() => handleDeleteClick(member._id)}
                            className="mt-4 text-black dark:bg-gray-300"
                            variant="outline"
                        >
                            ডিলিট করুন
                            <Delete />
                        </Button>
                    </div>
                })}
            </div>
            {allMembers.length > 0 && isAllProjectsModalOpen && (<AllMemberReportModal
                membersFromParent={allMembers}
                onClose={() => setIsAllProjectsModalOpen(false)}
                permanentMemberCount={permanentMemberCount}
                tempMemberCount={temopraryMemberCount}
                totalDepositAmount={totalDepositAmount}
            />)}
            {selectedMember && (
                <MemberReportModal
                    member={selectedMember}
                    onClose={closeModal}
                />
            )}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                // message="Are you sure you want to delete this project? This action cannot be undone."
                message={'আপনি কি নিশ্চিত যে আপনি এই মেম্বার ডিলিট করতে চান? ডিলিট করার পর আর এটা পুনরুদ্ধার করা যাবে না। ডিলিট করলে আমানত, ব্যবসা থেকেও মেম্বারের সমস্ত রেকর্ড মুছে যাবে।'}
            />
            <ToastContainer transition={Flip} />
        </div>
    );
};

export default MembersList;
