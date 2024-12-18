import { serverErrorResponse, successResponse } from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    body.addedOn = new Date();
    const membersCollection = await db.collection("members");
    const res = await membersCollection.insertOne(body);
    return successResponse(res, "Member Added.");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
