import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const PUT = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    const { projectId, memberId, amount, paymentDate } = body;
    const paymentInfo = { amount, date: new Date(paymentDate) };
    const projectCollection = await db.collection("projects");
    const result = await projectCollection.updateOne(
      {
        _id: new ObjectId(projectId),
        "members.memberId": new ObjectId(memberId),
      },
      {
        $push: { "members.$.payments": paymentInfo },
      }
    );

    if (result.modifiedCount > 0) {
      return successResponse(result,"সফলভাবে পেমেন্ট যোগ করা হয়েছে।.");
    } else {
      return serverErrorResponse(
        "পেমেন্ট যোগ করা সম্ভব হচ্ছেনা। পেইজ রিলোড দিন"
      );
    }
  } catch (e) {
    console.error(e.message)
    return serverErrorResponse(e.message);
  }
};
