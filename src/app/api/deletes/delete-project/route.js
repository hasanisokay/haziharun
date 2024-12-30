import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();

    const projectCollection = await db.collection("projects");
    const res = await projectCollection.deleteOne({
      _id: new ObjectId(body.id),
    });
    if (res.deletedCount === 0) {
      return serverErrorResponse("No matching project found to delete.");
    }
    return successResponse(res, "সফলভাবে ডিলিট করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
