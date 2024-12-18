import { z } from 'zod';

const memberFormSchema = z.object({
    name: z.string().min(1, "নাম লাগবে।"),
    father: z.string().min(1, "পিতার নাম দেয়া হয়নি।"),
    mother: z.string().min(1, "মায়ের নাম দেয়া হয়নি।"),
    village: z.string().min(1, "গ্রাম উল্লেখ করুন।"),
    post: z.string().min(1, "পোস্ট অফিস দিন।"),
    policeStation: z.string().min(1, "থানা উল্লেখ করুন"),
    district: z.string().min(1, "জেলা দিন"),
    mobileNumber: z.string().min(11, "মোবাইল নাম্বার ১১ ডিজিটের হতে হবে।"),
    email: z.string().email("সঠিক ই-ইমেইল দিন"),
    nationalId: z.string().min(10, "জাতীয় পরিচয়পত্র উল্লেখ করুন।"),
  });
export default memberFormSchema  