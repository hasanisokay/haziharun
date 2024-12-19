'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button'; // ShadCN button component
import { Input } from '@/components/ui/input'; // ShadCN input component
import { Label } from '@/components/ui/label'; // ShadCN label component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // ShadCN card component
import { Flip, toast, ToastContainer } from 'react-toastify';
import CustomDatePicker from '../datepicker/DatePicker';
import generateUniqueIds from '@/utils/generateUniqueIds.mjs';
import MemberSelector from '../selects/MemberSelector';
import { useState } from 'react';

// Validation Schema with Bangla Messages
const depositSchema = z.object({
    member: z
        .object({
            name: z.string().nonempty('সদস্য নির্বাচন করতে হবে।'),
            _id: z.string().nonempty('সদস্যের আইডি আবশ্যক।'),
        })
        .refine((data) => data.name && data._id, 'সদস্য নির্বাচন সঠিকভাবে সম্পন্ন হয়নি।'),
    amount: z
        .number({ invalid_type_error: 'জমার পরিমাণ একটি সংখ্যা হতে হবে।' })
        .positive('জমার পরিমাণ শূন্যের চেয়ে বেশি হতে হবে।'),
    depositDate: z.date({ invalid_type_error: 'জমার তারিখটি সঠিকভাবে নির্বাচন করুন।' }),
});

const NewDeposit = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            member: {},
            amount: '',
            depositDate: new Date(),
        },
    });
    const [loading, setLoading] = useState(false);
    const onSubmit = async (d) => {
        const data = { ...d, member: { memberId: d.member._id, name: d.member.name } };
        setLoading(true)
        try {
            const res = await fetch('/api/posts/new-deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const responseData = await res.json();
            console.log(responseData)
            if (responseData.status === 200) {
                toast.success(responseData.message || 'জমা সফল হয়েছে!');
                reset();
            } else {
                toast.error(responseData.message || responseData.error || 'জমা সম্পন্ন করা যায়নি। পেজ রিফ্রেশ করুন।');
            }
        } catch (error) {
            toast.error(error.message || 'সার্ভার ত্রুটি।');
        }finally{
            setLoading(false)
        }
    };

    return (
        <Card className={`dark:bg-gray-800 dark:text-gray-200 max-w-3xl mx-auto mt-4 ${loading ?"form-disable":""}`}>
            <CardHeader>
                <CardTitle>নতুন জমা</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Member Selector */}
                    <div>
                        <Label htmlFor="member">সদস্য নির্বাচন করুন</Label>
                        <Controller
                            name="member"
                            control={control}
                            render={({ field }) => (
                                <MemberSelector
                                    {...field}
                                    permanentMembersOnly={true}
                                    onChange={(value) => field.onChange(value)}
                                    id={generateUniqueIds(1)}
                                    clearSelection={loading}
                                />
                            )}
                        />
                        {errors.member && (
                            <p className="text-sm text-red-500 mt-1">{errors.member.message}</p>
                        )}
                    </div>

                    {/* Amount Input */}
                    <div>
                        <Label htmlFor="amount">জমার পরিমাণ</Label>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value || 0))}
                                    className="w-full dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="পরিমাণ লিখুন"
                                />
                            )}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
                        )}
                    </div>

                    {/* Date Picker */}
                    <div>
                        <Label htmlFor="depositDate">জমার তারিখ</Label>
                        <Controller
                            name="depositDate"
                            control={control}
                            render={({ field }) => (
                                <CustomDatePicker
                                    {...field}
                                    classNames="w-full dark:bg-gray-700"
                                    onDateChange={(date) => field.onChange(date)}
                                    showDateIcon={false}
                                    width="120px"
                                />
                            )}
                        />
                        {errors.depositDate && (
                            <p className="text-sm text-red-500 mt-1">{errors.depositDate.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full">
                        জমা দিন
                    </Button>
                </form>
            </CardContent>
            <ToastContainer transition={Flip} />
        </Card>
    );
};

export default NewDeposit;
