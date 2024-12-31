import {
  invalidCredentialsResponse,
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    const { oldPassword, newPassword, username } = body;
    const membersCollection = await db.collection("users"); 
    const user = await membersCollection.findOne(
      {
        username,
      },
      {
        projection: {
          password: 1,
          _id: 1,
          username: 1,
        },
      }
    );
    if (!user) {
      return invalidCredentialsResponse("ভুল হয়েছে। আবার ট্রাই করুন।");
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user?.password);

    if (!passwordMatch) {
      return invalidCredentialsResponse("পূর্বের পাসওয়ার্ড ভুল।");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedData = {
      $set: {
        password: hashedPassword,
      },
    };

    const res = await membersCollection.updateOne({ username }, updatedData);
    return successResponse(res, "সফলভাবে পরিবর্তন করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
