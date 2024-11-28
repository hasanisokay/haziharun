import { z } from 'zod';

const memberFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    father: z.string().min(1, "Father's name is required"),
    mother: z.string().min(1, "Mother's name is required"),
    village: z.string().min(1, "Village is required"),
    post: z.string().min(1, "Post is required"),
    policeStation: z.string().min(1, "Police station is required"),
    district: z.string().min(1, "District is required"),
    mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email format"),
    nationalId: z.string().min(10, "National ID number is required"),
  });
export default memberFormSchema  