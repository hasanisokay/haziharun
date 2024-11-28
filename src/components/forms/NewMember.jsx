'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';  
import { Button } from '@/components/ui/button';  
import { Label } from '@/components/ui/label';  
import memberFormSchema from "../schemas/newMemberFormSchema.mjs";

const NewMemberForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(memberFormSchema),
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        console.log(data);
        try {
            // Handle form submission, like making an API call
            console.log(data);

            // Show success toast from ShadCN
            toast({
                title: 'Success',
                description: 'Member added successfully!',
                variant: 'success',
            });
        } catch (error) {
            // Show error toast from ShadCN
            toast({
                title: 'Error',
                description: 'Something went wrong!',
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg dark:bg-gray-900 dark:text-gray-200">
            <h2 className="text-3xl font-bold mb-4 text-center">Add New Member</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    {/** Input Fields */}
                    {[
                        { label: "Name", id: "name" },
                        { label: "Father's Name", id: "father" },
                        { label: "Mother's Name", id: "mother" },
                        { label: "Village", id: "village" },
                        { label: "Post", id: "post" },
                        { label: "Police Station", id: "policeStation" },
                        { label: "District", id: "district" },
                        { label: "Mobile Number", id: "mobileNumber" },
                        { label: "Email", id: "email", type: "email" },
                        { label: "National ID", id: "nationalId" },
                    ].map(({ label, id, type = "text" }) => (
                        <div key={id}>
                            <Label htmlFor={id} className="block text-sm font-medium mb-1">
                                {label}
                            </Label>
                            <Input
                                id={id}
                                {...register(id)}
                                type={type}
                                className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
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
                                'Add Member'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewMemberForm;
