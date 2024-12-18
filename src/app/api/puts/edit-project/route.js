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
    
    const updatedData = {
      ...updatedFields,
      expiryDate: new Date(body.expiryDate),
      startDate: new Date(body.startDate),
      members: body.members.map((m) => ({
        ...m,
        willGetPercentage: parseFloat(m.willGetPercentage.toFixed(2)),
        memberId: new ObjectId(m.memberId),
        payments: m.payments
          ? m?.payments?.map((p) => ({ ...p, date: new Date(p.date) }))
          : [],
      })),
      updatedOn : new Date()
    };

    const membersCollection = await db.collection("projects");
    const res = await membersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    return successResponse(res, "সফলভাবে এডিট করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
