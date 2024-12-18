'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import memberFormSchema from "../schemas/newMemberFormSchema.mjs";
import { Slide, toast, ToastContainer, Zoom } from 'react-toastify';

const NewMemberForm = ({ id }) => {

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(memberFormSchema),
    });

    const [loading, setLoading] = useState(false);
    const [updateable, setUpdateable] = useState(false);
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            let method = "POST"
            let apiRoute = '/api/posts/add-new-member'
            if (updateable) {
                method = "PUT"
                apiRoute = '/api/puts/edit-member'
                data.id = id;
            }
            setLoading(true);
            const res = await fetch(apiRoute, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const d = await res.json();
            setLoading(false);
            if (d.status === 200) {
                toast.success(d.message || 'Member added successfully!', {
                    position: "top-right",
                    autoClose: 2000
                });

                reset()
                if (updateable) {
                    setUpdateable(false)
                    window.location.href = "/members";
                }
            }
            else {
                toast.error(`${d?.message}`, {
                    position: "top-right",
                    autoClose: 5000
                });

            }


        } catch (e) {
            toast.error(`${e.message}`, {
                position: "top-right",
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };
    const fetchMemberDetails = async () => {
        setLoading(true);
        const res = await fetch(`/api/gets/member?id=${id}`);
        const data = await res.json();
        if (data.status === 200) {
            setUpdateable(true);
            const m = data?.data?.member;
            setValue('name', m.name)
            setValue('father', m.father)
            setValue('mother', m.mother)
            setValue('nationalId', m.nationalId)
            setValue('email', m.email)
            setValue('district', m.district)
            setValue('village', m.village)
            setValue('policeStation', m.policeStation)
            setValue('post', m.post)
            setValue('mobileNumber', m.mobileNumber)
        } else {
            setUpdateable(false)
        }
        setLoading(false)
    }
    useEffect(() => {
        if (!id) return;
        if (id) {
            fetchMemberDetails()
        }
    }, [id])

    return (
        <div className={`max-w-2xl my-4 mx-auto dark:bg-gray-800 bg-white  text-black p-6 rounded-lg shadow-lg  dark:text-gray-200 ${loading ? "form-disable" : ""}`}>
            <h2 className="text-3xl font-bold mb-4 text-center">{loading ? "Loading..." : updateable ? "সদস্য এডিট করুন" : "নতুন সদস্য যোগ করুন"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    {/** Input Fields */}
                    {[
                        { label: "নাম", id: "name" },
                        { label: "পিতার নাম", id: "father" },
                        { label: "মায়ের নাম", id: "mother" },
                        { label: "গ্রাম", id: "village" },
                        { label: "পোস্ট", id: "post" },
                        { label: "থানা", id: "policeStation" },
                        { label: "জেলা", id: "district" },
                        { label: "মোবাইল নাম্বার", id: "mobileNumber" },
                        { label: "ই-মেইল", id: "email", type: "email" },
                        { label: "ন্যাশনাল আইডি", id: "nationalId" },
                    ].map(({ label, id, type = "text" }) => (
                        <div key={id}>
                            <Label htmlFor={id} className="block text-sm font-medium mb-1">
                                {label}
                            </Label>
                            <Input
                                id={id}
                                {...register(id)}
                                type={type}
                                className="w-full dark:bg-gray-700 bg-white dark:text-gray-100 text-black border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>
                            )}
                        </div>
                    ))}

                    {/** Submit Button */}
                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-md p-2 flex justify-center items-center"
                        >
                            {loading ? (
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                            ) : (
                                updateable ? "এডিট করুন" : 'যোগ করুন'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
            <ToastContainer transition={Slide} />
        </div>
    );
};

export default NewMemberForm;
