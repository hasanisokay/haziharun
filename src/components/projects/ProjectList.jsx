'use client'
import formatDate from "@/utils/formatDate.mjs";
import getRemainingDays from "@/utils/getRemainingDays.mjs";
import SearchBox from "../forms/SearchBox";
import Link from "next/link";
import DefaultSorting from "../selects/DefaultSoring";
import Edit from "../svg/Edit";
import { useEffect, useMemo, useState } from "react";
import PaymentModal from "../modal/PaymentModal";
import { Flip, toast, ToastContainer } from "react-toastify";


const ProjectList = ({ p }) => {
  const getProjectName = (p) => {
    if (p === "mudaraba") return "মুদারাবা";
    if (p === "baiMuajjal") return "বাইয়ে মুয়াজ্জাল";
  };
  const [projects, setProjects] = useState(p)
  useEffect(() => { setProjects(p) }, [p])
  const memorizedProjects = useMemo(() => projects, [projects]);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMembers, setModalMembers] = useState([]);
  const [modalProjectId, setModalProjectId] = useState(null);

  const openModal = (members, projectId) => {
    setModalMembers(members);
    setModalProjectId(projectId);
    setIsModalOpen(true);
  };

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
          paymentDate: date
        }),
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success(`${data?.message}`, {
          position: "top-right",
          autoClose: 2000
        });
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === modalProjectId
              ? {
                ...project,
                members: project.members.map((member) =>
                  member.memberId === memberId
                    ? {
                      ...member,
                      payments: [...(member.payments || []), { amount, date }],
                    }
                    : member
                ),
              }
              : project
          )
        );
      } else {
        toast.error(data?.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
    finally {
      closeModal();
      setLoading(false);
    }
  };
  const filterOptions = [
    { value: "expired_items_only", label: "শুধু মেয়াদোত্তীর্ণ" },
    { value: "all", label: "সবগুলো" },
    { value: "active_only", label: "মেয়াদ আছে এমন" },
  ];
  const sortOptions = [
    { value: "newest", label: "নতুন" },
    { value: "oldest", label: "পুরাতন" },
  ];
  return (
    <div className="space-y-6 mt-4 ">
      <SearchBox placeholder={"নাম, মেম্বার, বর্ণনা অনুযায়ী সার্চ করুন"} />
      <div className="flex flex-wrap lg:gap-10 md:gap-4 gap-2 items-center">
        <DefaultSorting sortingOptionsProps={filterOptions} field="filter" />
        <DefaultSorting sortingOptionsProps={sortOptions} field="sort" />
      </div>
      {memorizedProjects?.map((project) => {
        const remainingDays = getRemainingDays(project.expiryDate);
        return (
          <div
            key={project._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-custom1"
          >
            {/* Project Header */}
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
                <button
                  onClick={() => openModal(project.members, project._id)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  পেমেন্ট দিন
                </button>
              </div>
              <div className="space-y-2">

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getProjectName(project.projectType)}
                </p>
                <button
                  className="rounded-lg shadow-md"
                >
                  <Link href={`/projects/new?id=${project?._id}`}>
                    <Edit />
                  </Link>
                </button>
              </div>
            </div>

            {/* Project Details */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-medium">মোটঃ</span> ৳
                {project.totalAmount.toLocaleString()}
              </p>
              <p>
                <span className="font-medium max-w-[200px] whitespace-pre">
                  বর্ণনাঃ
                </span>{" "}
                {project.note || "N/A"}
              </p>
              <p>
                <span className="font-medium">শুরুর তারিখঃ</span>{" "}
                {formatDate(project.startDate)}
              </p>
              <p>
                <span className="font-medium">মেয়াদ উত্তীর্ণের তারিখঃ</span>{" "}
                {formatDate(project.expiryDate)}
              </p>
            </div>

            {/* Members Table */}
            <div className="mt-4 overflow-x-auto">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                সদস্যঃ
              </h3>
              <table className="w-full mt-2 border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                    <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                      নাম
                    </th>
                    <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                      বিনিয়োগ
                    </th>
                    <th className="px-4 py-2 min-w-[160px] font-medium text-gray-600 dark:text-gray-400">
                      পেয়েছেন
                    </th>
                    <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                      বাকি আছে
                    </th>
                    <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                      মোট পাবেন
                    </th>
                    <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                      {project.projectType === "mudaraba"
                        ? "লাভ/লস পাবেন"
                        : "লাভ পাবেন"}
                    </th>
                    {project.projectType === "mudaraba" && (
                      <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                        পার্সেন্টেজ
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {project.members.map((member) => {
                    let totalPaid = member?.payments ? member.payments.reduce((acc, currentV) => acc + currentV?.amount, 0) : 0
                    return (
                      <tr
                        key={member.memberId}
                        className="border-b border-gray-300 dark:border-gray-600"
                      >
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {member.name}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          ৳{member.amountInvested.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {member?.payments ? <div>
                            {member?.payments?.map((p, index) => <div key={index}>
                              <p>{formatDate(p.date)} তারিখে ৳{p.amount.toLocaleString()}</p>
                            </div>)}
                            {totalPaid > 0 ? <p className="py-1 font-semibold">মোটঃ <span className="font-semibold">৳{totalPaid.toLocaleString()}</span></p> : <p>0</p>
                            }
                          </div> : <p>0</p>}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {/* ৳{member.willGetAmount.toLocaleString()} */}
                          ৳{(member.amountInvested + member.willGetAmount - totalPaid).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">

                          {
                            project.projectType === 'mudaraba' ? <p> ৳{member.amountInvested.toLocaleString()} ± {member.willGetAmount.toLocaleString()}</p> : <p> ৳{(member.amountInvested + member.willGetAmount).toLocaleString()}</p>
                          }
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        members={modalMembers}
        onSubmit={handlePaymentSubmit}
      />
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default ProjectList;
