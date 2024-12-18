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
    const { id, ...updatedFields } = body;
    body.updatedOn = new Date();
    const membersCollection = await db.collection("members");
    const res = await membersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );
    return successResponse(res, "সদস্য সফলভাবে এডিট করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
