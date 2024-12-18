import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    body.addedOn = new Date();
    body.payments = [];
    const updatedData = {
      ...body,
      expiryDate: new Date(body.expiryDate),
      startDate: new Date(body.startDate),
      members: body.members.map((m) => ({
        ...m,
        willGetPercentage: parseFloat(m.willGetPercentage.toFixed(2)),
        memberId: new ObjectId(m.memberId),
      })),
    };
    const membersCollection = await db.collection("projects");
    const res = await membersCollection.insertOne(updatedData);
    return successResponse(res, "সফলভাবে যোগ করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
