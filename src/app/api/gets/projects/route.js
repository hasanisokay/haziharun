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
        { "$members.name": { $regex: keyword, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      matchStage.expiryDate = {};
      if (startDate) matchStage.expiryDate.$gte = startDate;
      if (endDate) matchStage.expiryDate.$lte = endDate;
    }

    // Determine sort field and order
    let sortField = null;
    let sortOrder = 1; // Ascending by default
    if (sort === "expired_items_only") {
      sortField = "expiryDate";
      sortOrder = 1; // Expired items sorted by oldest expiry date first
      matchStage.expiryDate = { $lt: new Date() }; // Only expired items
    } else if (sort === "non_expired") {
      sortField = "expiryDate";
      sortOrder = 1; // Active items sorted by nearest expiry date first
      matchStage.expiryDate = { $gte: new Date() }; // Only non-expired items
    } else if (sort === "all") {
      sortField = "expiryDate";
      sortOrder = 1; 
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
