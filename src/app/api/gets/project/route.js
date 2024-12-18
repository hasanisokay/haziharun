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
    if (!id) return serverErrorResponse("No id found.");
    const membersCollection = await db.collection("projects");
    const res = await membersCollection.findOne({ _id: new ObjectId(id) });
    return successResponse(res, "Project Found");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
