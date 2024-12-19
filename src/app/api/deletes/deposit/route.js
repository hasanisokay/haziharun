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

    const depositCollection = await db.collection("deposits");
    const res = await depositCollection.deleteOne({_id: new ObjectId(body.id)});
    return successResponse(res, "সফলভাবে ডিলিট করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
