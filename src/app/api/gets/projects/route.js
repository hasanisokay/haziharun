import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("expiryDate");
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;
    const keyword = searchParams.get("keyword");
    const sort = searchParams.get("sort") || "all"; // Default to 'all' if no sort parameter
    const filter = searchParams.get("filter") || "";
    const currentProjectsOnly = searchParams.get("current_projects_only");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const db = await dbConnect();
    if (!db) return serverErrorResponse("Database error");

    const matchStage = {};
    if (keyword) {
      matchStage.$or = [
        { note: { $regex: keyword, $options: "i" } },
        { projectName: { $regex: keyword, $options: "i" } },
        { "members.name": { $regex: keyword, $options: "i" } },
      ];
    }
    if (startDate || endDate) {
      matchStage.expiryDate = {};
      if (startDate) matchStage.expiryDate.$gte = startDate;
      if (endDate) matchStage.expiryDate.$lte = endDate;
    }

    let sortOrder = -1;
    let sortField = "addedOn";
    if (sort === "newest") {
      sortOrder = -1;
    } else if (sort === "oldest") {
      sortOrder = 1;
    }
    if(currentProjectsOnly){
      matchStage.expiryDate = { $gte: new Date() };
      sortField = "expiryDate";
      sortOrder = 1;
    }
    if (filter === "expired_items_only") {
      matchStage.expiryDate = { $lt: new Date() };
    } else if (filter === "active_only") {
      matchStage.expiryDate = { $gte: new Date() };
    }

    const projectCollection = await db.collection("projects");

    const result = await projectCollection
      .find(matchStage)
      .sort(sortField ? { [sortField]: sortOrder } : {})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await projectCollection.countDocuments(matchStage);
    return successResponse({ projects: result, totalCount }, "Success");
  } catch (error) {
    console.error(error);
    return serverErrorResponse();
  }
};
