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

    const data = {
      ...body,
      depositDate: new Date(body.depositDate),
      member: { ...body.member, memberId: new ObjectId(body.member.memberId) },
    };
    const depositCollection = await db.collection("deposits");
    const res = await depositCollection.insertOne(data);
    return successResponse(res, "সফলভাবে যোগ করা হয়েছে।");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
