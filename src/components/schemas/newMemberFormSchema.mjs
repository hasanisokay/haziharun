import { z } from 'zod';

const memberFormSchema = z.object({
    name: z.string().min(1, "নাম লাগবে।"),
    type: z.boolean().optional(),
    father: z.string().optional(),
    mother: z.string().optional(),
    village: z.string().optional(),
    post: z.string().optional(),
    policeStation: z.string().optional(),
    district: z.string().optional(),
    mobileNumber: z.string().optional(),
    email: z.string().optional(),
    nationalId: z.string().optional(),
});

export default memberFormSchema;
