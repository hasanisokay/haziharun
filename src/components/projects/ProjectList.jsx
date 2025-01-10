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
import ProjectDetailsModal from "./ProjectDetailsModal";
import getProjectName from "@/utils/getProjectName.mjs";
import calculateDurationInDays from "@/utils/calculateDurationInDays.mjs";
import Report from "../svg/Report";
import { Button } from '@/components/ui/button';
import Delete from "../svg/Delete";
import ConfirmModal from "../modal/ConfirmModal";
import ProjectsSummaryModal from "../modal/ProjectsSummaryModal";
import getProjects from "@/utils/getProjects.mjs";
import getSummary from "@/utils/getSummary.mjs";
import convertToBanglaNumber from "@/utils/convertToBanglaNumber.mjs";

const ProjectList = ({ p }) => {
  const [projects, setProjects] = useState(p)
  useEffect(() => { setProjects(p) }, [p])
  const memorizedProjects = useMemo(() => projects, [projects]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMembers, setModalMembers] = useState([]);
  const [modalProjectId, setModalProjectId] = useState(null);
  const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loadingAllProjects, setLoadingAllProjects] = useState(false);
  const [summary, setSummary] = useState(null);
  const [amountsSummary, setAmountsSummary] = useState(null);
  const handleAllProjectsClick = async () => {
    setLoadingAllProjects(true)
    if (allProjects.length > 0) {
      setLoadingAllProjects(false)
      setIsAllProjectsModalOpen(true);
      return;
    }
    const d = await getProjects(1, 999999999, "newest", '', '');
    if (d.status === 200) {
      setAllProjects(d?.data?.projects);
    }

    const s = await getSummary();
    if (s.status === 200) {
      setSummary(s?.data);
    }
    const data = await fetch("/api/gets/amounts-summary");
    const res = await data.json();
    if (res.status === 200) {
      setAmountsSummary(res?.data);
    }

    setLoadingAllProjects(false)
    setIsAllProjectsModalOpen(true);
  };

  const closeAllProjectsModal = () => {
    setIsAllProjectsModalOpen(false);
  };

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setIsConfirmModalOpen(true);
  };
  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setIsConfirmModalOpen(false);
      setProjectToDelete(null);
    }
  };
  const deleteProject = async (projectId) => {
    try {
      const res = await fetch("/api/deletes/delete-project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      });
      const data = await res.json();
      if (data.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000
        });
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 2000
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000
      });
    }
  }
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

  const openDetailsModal = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
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
    { value: "expired_items_only", label: "সমাপ্ত হয়েছে" },
    { value: "all", label: "সবগুলো" },
    { value: "active_only", label: "চলমান আছে" },
  ];
  const sortOptions = [
    { value: "newest", label: "নতুন" },
    { value: "oldest", label: "পুরাতন" },
  ];


  return (
    <div className="space-y-6 mt-4 ">
      <div >
        <Button onClick={handleAllProjectsClick} className="bg-blue-500 text-white">
          {loadingAllProjects ? "লোড হচ্ছে..." : "সকল প্রোজেক্ট রিপোর্ট দেখুন"}
        </Button>
      </div>
      <SearchBox placeholder={"নাম, মেম্বার, বর্ণনা অনুযায়ী সার্চ করুন"} />
      <div className="flex flex-wrap lg:gap-10 md:gap-4 gap-2 items-center">
        <DefaultSorting sortingOptionsProps={filterOptions} field="filter" />
        <DefaultSorting sortingOptionsProps={sortOptions} field="sort" />
      </div>
      <div id="projects-section">
        {memorizedProjects?.map((project, index) => {
          const remainingDays = getRemainingDays(project.expiryDate);
        const paymentDue =  project?.members?.some((member) => {
            let totalPaid = member?.payments ? member?.payments?.reduce((acc, currentV) => acc + currentV?.amount, 0) : 0;
            if (totalPaid < 1 || member?.amountInvested + member?.willGetAmount - totalPaid > 0) {
              return true; 
            }
            return false; 
          });
          return (
            <div
              key={project._id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-custom1"
            >
              {/* Project Header */}
              <span style={{ fontSize: '14px', color: '#374151', }} className="dark:text-white text-[#374151]" >প্রকল্প নং- {convertToBanglaNumber(index + 1)}</span>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {project.projectName}
                  </h2>

                {paymentDue &&  <span
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
                  </span>}
                  {paymentDue && <button
                    onClick={() => openModal(project.members, project._id)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    পেমেন্ট দিন
                  </button>}
                </div>
                <div className="space-y-2">

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getProjectName(project.projectType)}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => openDetailsModal(project)}
                    >
                      <Report />
                    </button>
                    <button
                      className="rounded-lg shadow-md"
                    >
                      <Link href={`/projects/new?id=${project?._id}`}>
                        <Edit />
                      </Link>
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <span className="font-medium">মোটঃ</span> &#2547;
                  {project.totalAmount.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium max-w-[200px] whitespace-pre">
                    বর্ণনাঃ
                  </span>{" "}
                  {project.note || "N/A"}
                </p>

                <p>
                  <span className="font-medium">শুরু হয়েছেঃ</span>{" "}
                  {formatDate(project.startDate)}
                </p>
                <p>
                  <span className="font-medium">{new Date(project.expiryDate) < new Date() ? 'শেষ হয়েছেঃ' : 'শেষ হবেঃ'} </span>{" "}
                  {formatDate(project.expiryDate)}
                </p>
                <p>
                  <span className="font-medium">স্থায়ীত্বকালঃ </span> {calculateDurationInDays(project.startDate, project.expiryDate) + " দিন"}
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

                      <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                        {project.projectType === "mudaraba"
                          ? "লাভ/লস পাবেন"
                          : "লাভ পাবেন"}
                      </th>
                      <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                        মোট পাবেন
                      </th>
                      <th className="px-4 py-2 min-w-[160px] font-medium text-gray-600 dark:text-gray-400">
                        পেয়েছেন
                      </th>
                      <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                        বাকি আছে
                      </th>

                      <th className="px-4 py-2 min-w-[130px] font-medium text-gray-600 dark:text-gray-400">
                        পার্সেন্টেজ
                      </th>
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
                            &#2547;{member.amountInvested.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            &#2547;{member.willGetAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">

                            {
                              project.projectType === 'mudaraba' ? <p> &#2547;{member.amountInvested.toLocaleString()} ± {member.willGetAmount.toLocaleString()}</p> : <p> &#2547;{(member.amountInvested + member.willGetAmount).toLocaleString()}</p>
                            }
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {member?.payments ? <div>
                              {member?.payments?.map((p, index) => <div key={index}>
                                <p>{formatDate(p.date)} তারিখে &#2547;{p.amount.toLocaleString()}</p>
                              </div>)}
                              {totalPaid > 0 ? <p className="py-1 font-semibold">মোটঃ <span className="font-semibold">&#2547;{totalPaid.toLocaleString()}</span></p> : <p>0</p>
                              }
                            </div> : <p>0</p>}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {/* &#2547;{member.willGetAmount.toLocaleString()} */}
                            &#2547;{(member.amountInvested + member.willGetAmount - totalPaid).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {member.willGetPercentage}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <Button
                onClick={() => handleDeleteClick(project._id)}
                className="mt-4 text-black dark:bg-gray-300"
                variant="outline"
              >
                ডিলিট করুন
                <Delete />
              </Button>
            </div>
          );
        })}
      </div>
      {selectedProject && (
        <ProjectDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          project={selectedProject}
        />
      )}
      <ProjectsSummaryModal
        projects={allProjects}
        isOpen={isAllProjectsModalOpen}
        onClose={closeAllProjectsModal}
        // showPaymentOption={showPaymentOption}
        summary={summary}
        amountsSummary={amountsSummary}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        // message="Are you sure you want to delete this project? This action cannot be undone."
        message={'আপনি কি নিশ্চিত যে আপনি এই প্রোজেক্ট ডিলিট করতে চান? ডিলিট করার পর এটা পুনরুদ্ধার করা যাবে না।'}
      />
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
