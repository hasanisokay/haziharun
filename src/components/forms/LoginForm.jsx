'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import loginSchema from '../schemas/loginSchema.mjs';
import { Flip, toast, ToastContainer} from 'react-toastify';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/authSlice";

const LoginForm = ({redirectTo}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const dispatch = useDispatch();
const router = useRouter()
    // Submit handler
    const onSubmit = async (d) => {
        const res = await fetch('/api/posts/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(d)
        })
        const data = await res.json();
        if(data.status===200){
            toast.success(`${data?.message}` , {
                position: "top-right",
                autoClose: 2000
              });
            dispatch(setUserData(data.data))
            window.location.href = redirectTo;
        }else{
            toast.error(`${data?.message}` , {
                position: "top-center",
                autoClose: 5000
              });
        }

    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <Card className="w-full sm:w-96 p-6 shadow-lg rounded-lg bg-white">
                <h2 className="text-xl font-semibold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            {...register('username')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Login
                    </Button>
                </form>
            </Card>
            <ToastContainer transition={Flip} />
        </div>
    );
};

export default LoginForm;
