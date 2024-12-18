'use client';
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MemberSelector from "../selects/MemberSelector";
import generateUniqueIds from "@/utils/generateUniqueIds.mjs";
import CustomDatePicker from "../datepicker/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Slide, toast, ToastContainer } from "react-toastify";
import formatDate from "@/utils/formatDate.mjs";

// Zod Schema 
const schema = z.object({
  projectType: z.enum(["mudaraba", "baiMuajjal"]),
  expiryDate: z.date({ message: "মেয়াদ উত্তীর্নের তারিখ দিন!" }),
  startDate: z.date({ message: "শুরুর তারিখ দিন!" }),
  totalAmount: z.number().min(1, "মোট টাকার পরিমাণ দিন!"),
  projectName: z.string().optional(),
  note: z.string().optional(),
  members: z.array(
    z.object({
      memberId: z.string(),
      name: z.string(),
      amountInvested: z.number().min(1, "ইনভেস্টের পরিমাণ ০ থেকে বেশি হতে হবে।"),
      willGetPercentage: z.number().optional(),
      willGetAmount: z.number().optional(),
    })
  ).min(1, "সদস্য বাছাই করুন। কমপক্ষে ১ জন")
});

const NewProjectForm = ({ id }) => {
  const [projectType, setProjectType] = useState("mudaraba");
  const [members, setMembers] = useState([]);
  const [updateable, setUpdateable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectType,
      status: "active",
      note: "",
      projectName: "",
      expiryDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
      startDate: new Date(),
      totalAmount: 0,
      members: members,
    }
  });

  const handleMemberChange = (selectedMember) => {
    let memberWillGet = projectType === "mudaraba" ? { willGetPercentage: 0 } : { willGetAmount: 0 };
    if (members?.length > 0) {
      const previouslyAdded = members?.find(m => m?.memberId === selectedMember?._id);
      if (previouslyAdded) return;
    }

    const updatedMembers = {
      name: selectedMember.name,
      memberId: selectedMember._id,
      amountInvested: 0,
      ...memberWillGet
    };
    setMembers(prev => {
      const prevMembers = Array.isArray(prev) ? prev : [];
      let upMembers = [...prevMembers, updatedMembers];
      setValue('members', upMembers);
      return upMembers;
    });


  };

  const handleMemberWillGetValueChange = (memberId, v, investAmount) => {
    const value = parseFloat(v) || 0
    const updatedMembers = members.map(member =>
      member.memberId === memberId
        ? {
          ...member,
          [projectType === "mudaraba" ? "willGetPercentage" : "willGetAmount"]: parseFloat(value),
          ...(projectType === "mudaraba"
            ? { willGetAmount: (investAmount * parseFloat(value)) / 100 }
            : { willGetPercentage: value * 100 / investAmount })
        }
        : member
    );

    setMembers(updatedMembers);
    setValue('members', updatedMembers);
  };


  const handleChangeAmountInvested = (memberId, value) => {
    const updatedMembers = members.map(member =>
      member.memberId === memberId ? { ...member, amountInvested: parseFloat(value) || 0 } : member
    );
    setMembers(updatedMembers);
    setValue('members', updatedMembers);
  };

  const removeMemberFromList = (id) => {

    setMembers(prev => {
      const updatedMembers = prev?.filter(i => i.memberId !== id)
      setValue('members', updatedMembers)
      return updatedMembers;
    });
  };
  const getProjectDetails = async () => {
    setLoading(true);
    const res = await fetch(`/api/gets/project?id=${id}`);
    const data = await res.json();
    console.log(data)
    if (data?.status === 200) {
      setUpdateable(true);
      const p = data.data;
      setValue('projectName', p.projectName)
      setValue('projectType', p.projectType)
      setValue('startDate', new Date(p.startDate))
      setValue('expiryDate', new Date(p.expiryDate))
      setValue('totalAmount', p.totalAmount)
      setValue('note', p.note)
      setValue('members', p.members)
      setMembers(p?.members)
    }
    setLoading(false);
  }
  useEffect(() => {
    if (!id) return;
    if (id) {
      getProjectDetails()
    }
  }, [id])

  const onSubmit = async (d) => {
    let apiPath = "/api/posts/new-project";
    let method = 'POST';
    if (updateable) {
      apiPath = '/api/puts/edit-project';
      method = "PUT";
      d.id = id;
      d.members = members;
    }
    const res = await fetch(apiPath, {
      body: JSON.stringify(d),
      headers: {
        "Content-Type": "application/json"
      },
      method: method
    })
    const data = await res.json();
    if (data.status === 200) {
      toast.success(data?.message, {
        position: "top-right",
        autoClose: 5000
      })
      reset()
      setMembers([])
      if (updateable) {
        window.location.href = "/projects"
      }
    } else {
      toast.error(data?.message, {
        position: "top-right",
        autoClose: 5000
      })
    }
  };
  // console.log(members)
  return (
    <div className={`container mx-auto p-6 min-h-screen bg-gray-50 dark:bg-[#343541] shadow-lg rounded-lg max-w-3xl ${loading ? "form-disable" : ""}`}>
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">{updateable ? "এডিট করুন" : "নতুন প্রজেক্ট"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Name */}
        <div>
          <Label htmlFor="projectName" className="block text-lg font-medium text-gray-700 dark:text-white mb-3">ব্যবসার নামঃ</Label>
          <Input
            type="string"
            id="projectName"
            value={watch("projectName")}
            onChange={(e) => setValue("projectName", e.target.value || "")}
            placeholder="নাম (optional)"
          />
        </div>
        <div>
          <Label htmlFor="note" className="block text-lg font-medium text-gray-700 dark:text-white mb-3">ব্যবসার বর্ণনা</Label>
          <Textarea
            id="note"
            value={watch("note")}
            onChange={(e) => setValue("note", e.target.value || "")}
            placeholder="বর্ণনা (optional)"
          />
        </div>
        {/* Project Type */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-white mb-3">
            ব্যবসার ধরন
          </label>
          <Controller
            name="projectType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setProjectType(value);
                  setMembers([]);
                }}
                className="flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="mudaraba"
                    id="mudaraba"
                    className="shadcn-radio-group border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <Label
                    htmlFor="mudaraba"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    মুদারাবা
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="baiMuajjal"
                    id="baiMuajjal"
                    className="shadcn-radio-group border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <Label
                    htmlFor="baiMuajjal"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    বাইয়ে মুয়াজ্জাল
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>


        {/* Expiry Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">চুক্তি শুরুর তারিখ</label>
            <CustomDatePicker
              width={"100%"}
              classNames={'text-black'}
              defaultValue={watch("startDate") || new Date()}
              onDateChange={(e) => setValue('startDate', e)}
              placeholder="Select Start Date"
            />
            {errors?.startDate && <p className="text-red-600 text-sm mt-1">{errors?.startDate?.message}</p>}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">মেয়াদ উত্তীর্ণের তারিখ</label>
            <CustomDatePicker
              defaultValue={watch("expiryDate") || new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())}
              width={"100%"}
              classNames={'text-black'}
              onDateChange={(e) => setValue('expiryDate', e)}
              placeholder="Select Expiry Date"
            />
            {errors?.expiryDate && <p className="text-red-600 text-sm mt-1">{errors?.expiryDate?.message}</p>}
          </div>
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-white mb-2">মোট টাকা</label>
          <Input
            type="number"
            value={watch("totalAmount")}
            onChange={(e) => setValue("totalAmount", parseFloat(e.target.value) || 0)}

            className="w-full"
            placeholder="Enter Total Amount"
          />
          {errors?.totalAmount && <p className="text-red-600 text-sm mt-1">{errors?.totalAmount?.message}</p>}
        </div>

        {/* Member Selector */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-white mb-3">সদস্য বাছাই করুন</label>
          <MemberSelector
            onChange={handleMemberChange}
            id={generateUniqueIds(1)}
            clearSelection={projectType}
          />
          {errors?.members && <p className="text-red-600 text-sm mt-1">{errors?.members?.message}</p>}
        </div>

        {/* Members Details */}
        {members?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">নির্বাচিত সদস্যঃ</h3>
            <div className="space-y-6">
              {members?.map((member, index) => (
                <div key={member.memberId} className="p-4 bg-white dark:bg-slate-800 shadow-md rounded-lg">
                  <p className="text-lg font-medium text-gray-800 dark:text-white">নামঃ {member.name}</p>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div>
                      <Label htmlFor="amountInvested" className="block text-gray-700 dark:text-white mb-2">ইনভেস্টকৃত মোট টাকাঃ</Label>
                      <Input
                        type="number"
                        id="amountInvested"
                        value={member?.amountInvested || 0}
                        onChange={(e) => handleChangeAmountInvested(member.memberId, e.target.value)}
                        placeholder="Amount Invested"
                      />
                    </div>
                    <div>
                      <Label htmlFor="willGet" className="block text-gray-700 dark:text-white mb-2">{projectType === "mudaraba" ? "পার্সেন্টেজ পাবেনঃ" : "লাভ পাবেনঃ"}</Label>
                      <Input
                        type="number"
                        id="willGet"
                        value={projectType === "mudaraba" ? member?.willGetPercentage : member?.willGetAmount}
                        onChange={(e) => handleMemberWillGetValueChange(member.memberId, e.target.value, member?.amountInvested)}
                        placeholder={projectType === "mudaraba" ? "Percentage (%)" : "Fixed Amount"}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-white mt-4">
                    মোট পাবেনঃ{" "}
                    {projectType === "mudaraba"
                      ? `${member?.amountInvested} ± ${member?.willGetAmount || 0}`
                      : member?.amountInvested + member?.willGetAmount}{" "}
                    টাকা
                  </p>
                  <div>
                    {

                      member.payments && <div className="py-3">
                        <h2>টাকা পেয়েছেনঃ</h2>
                        {
                          member?.payments?.map((p, paymentsIndex) => {
                            return <div key={paymentsIndex} className="flex items-center gap-2 ">
                              <div className="flex items-center">
                                <CustomDatePicker
                                  width={'120px'}
                                  showDateIcon={false}
                                  onDateChange={(e) => {
                                    setMembers(prevMembers => {
                                      return prevMembers.map(m => {
                                        return m.memberId === member.memberId ? {
                                          ...m, payments: m.payments.map((p, i) => i === paymentsIndex ? { ...p, date: e } : p)
                                        } : m
                                      })
                                    })
                                  }}
                                  classNames={'w-full p-0'}
                                  defaultValue={new Date(p.date)}
                                />
                                <span>তারিখে{" "}</span>
                              </div>
                              <div className="flex items-center">
                                <span>৳</span>
                                <Input
                                  type="number"
                                  id={`paidAmount${paymentsIndex}`}
                                  value={p.amount || 0}
                                  onChange={(e) => {
                                    setMembers(prevMembers => {
                                      return prevMembers.map(m => {
                                        return m.memberId === member.memberId ? {
                                          ...m, payments: m.payments.map((p, i) => i === paymentsIndex ? { ...p, amount: parseFloat(e.target.value || 0) } : p)
                                        } : m
                                      })
                                    })
                                  }
                                }
                                  placeholder="টাকা পেয়েছেন"
                                />
                                <svg
                                  onClick={() => {
                                    setMembers(prevMembers => {
                                      return prevMembers.map(m => {
                                        return m.memberId === member.memberId ? {
                                          ...m, payments: m.payments.filter((p, i) => i !== paymentsIndex)
                                        } : m
                                      })
                                    })
                                  }}
                                  className="cursor-pointer"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <g
                                    id="SVGRepo_iconCarrier"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                  >
                                    <path d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          })
                        }
                      </div>
                    }
                  </div>
                  <Button
                    onClick={() => removeMemberFromList(member.memberId)}
                    className="mt-4 text-black dark:bg-gray-300"
                    variant="outline"
                  >
                    ডিলিট করুন
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <g
                        id="SVGRepo_iconCarrier"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9z"></path>
                      </g>
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {updateable ? "আপডেট করুন" : "সেইভ করুন"}
        </Button>
      </form>
      <ToastContainer transition={Slide} />
    </div>

  );
};

export default NewProjectForm;
