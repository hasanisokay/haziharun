'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flip, toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import EyeOff from "../svg/EyeOff";
import Eye from "../svg/Eye";

const schema = z
    .object({
        oldPassword: z.string().min(3, "পুরানো পাসওয়ার্ড কমপক্ষে ৩টি অক্ষরের হতে হবে।"),
        newPassword: z
            .string()
            .min(3, "নতুন পাসওয়ার্ড কমপক্ষে ৩টি অক্ষরের হতে হবে।"),
        confirmPassword: z
            .string()
            .min(3, "পাসওয়ার্ড নিশ্চিতকরণ কমপক্ষে ৩টি অক্ষরের হতে হবে।")
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "পাসওয়ার্ডগুলি মেলেনি।",
    });



export default function PasswordResetForm() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = useSelector(state => state.user.userData);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (d) => {
        const data = { ...d, username: user.username };
        const response = await fetch("/api/posts/reset-password", {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            credentials: 'include'
        });
        const result = await response.json();
        if (result.status === 200) {
            router.push('/');
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }
    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">পাসওয়ার্ড পরিবর্তন</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Old Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পুরাতন পাসওয়ার্ড</label>
                    <div className="relative">
                        <input
                            type={showOldPassword ? "text" : "password"}
                            {...register("oldPassword")}
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                        >
                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.oldPassword && <p className="text-sm text-red-500 mt-1">{errors.oldPassword.message}</p>}
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নতুন পাসওয়ার্ড</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            {...register("newPassword")}
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নতুন পাসওয়ার্ড আবার দিন</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    পাসওয়ার্ড পরিবর্তন করুন
                </button>
            </form>
            <ToastContainer transition={Flip} />
        </div>
    );
}
