import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    const membersCollection = await db.collection("members");
    const res = await membersCollection.findOne({ _id: new ObjectId(id) });
    return successResponse({ member: res }, "Member Found");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
