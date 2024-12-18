import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const startDateStr = searchParams.get("fields");
    const keyword = searchParams.get("keyword");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page"));
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {};
    
    if (keyword) {
      matchStage.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { father: { $regex: keyword, $options: "i" } },
        { mother: { $regex: keyword, $options: "i" } },
        { district: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { mobileNumber: { $regex: keyword, $options: "i" } },
        { nationalId: { $regex: keyword, $options: "i" } },
        { village: { $regex: keyword, $options: "i" } },
        { policeStation : { $regex: keyword, $options: "i" } },
      ];
    }

    const membersCollection = await db.collection("members");
    const res = await membersCollection.find(matchStage).toArray();
    const totalCount = await membersCollection.countDocuments(matchStage);
    return successResponse({ members: res, totalCount }, "Members Found");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
