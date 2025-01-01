import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    if (!db) return serverErrorResponse("Database error");

    const projectCollection = await db.collection("projects");
    const memberCollection = await db.collection("members");

    // Aggregating member counts for permanent and temporary members
    const memberTypeCount = await memberCollection
      .aggregate([
        {
          $group: {
            _id: "$type", // Group by member type
            count: { $sum: 1 }, // Count the number of members for each type
          },
        },
      ])
      .toArray();

    // Extracting the counts for permanent and temporary members, defaulting to 0 if not found
    const permanentMembers =
      memberTypeCount.find((m) => m._id === "permanent")?.count || 0;
    const temporaryMembers =
      memberTypeCount.find((m) => m._id === "temporary")?.count || 0;

    // Aggregating project-related data
    const result = await projectCollection
      .aggregate([
        {
          $facet: {
            // 1. Total Projects
            totalProjects: [{ $count: "count" }],
            // 2. Finished Projects (projects with expired expiryDate)
            finishedProjects: [
              { $match: { expiryDate: { $lte: new Date() } } },
              { $count: "count" },
            ],
            // 3. Running Projects (projects with future expiryDate)
            runningProjects: [
              { $match: { expiryDate: { $gt: new Date() } } },
              { $count: "count" },
            ],
            // 4. Total Amount Invested and Total Profit (from members array)
            amountInvestedData: [
              { $unwind: "$members" },
              {
                $group: {
                  _id: null,
                  totalAmountInvested: { $sum: "$members.amountInvested" },
                  totalWillGetAmount: { $sum: "$members.willGetAmount" },
                },
              },
            ],
          },
        },
      ])
      .toArray();

    // Extract the results from the aggregation
    const totalProjects = result[0]?.totalProjects[0]?.count || 0;
    const finishedProjects = result[0]?.finishedProjects[0]?.count || 0;
    const runningProjects = result[0]?.runningProjects[0]?.count || 0;
    const totalAmountInvested = result[0]?.amountInvestedData[0]?.totalAmountInvested || 0;
    const totalProfit = result[0]?.amountInvestedData[0]?.totalWillGetAmount || 0;

    // Returning the results in a structured response
    return successResponse(
      {
        permanentMembers,
        temporaryMembers,
        totalProjects,
        finishedProjects,
        runningProjects,
        totalAmountInvested,
        totalProfit,
      },
      "Success"
    );
  } catch (error) {
    console.error(error);
    return serverErrorResponse();
  }
};
