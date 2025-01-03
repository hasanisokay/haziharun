import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    const projectsCollection = db.collection("projects");

    // Aggregation pipeline to calculate total payments and total will get amount
    const summary = await projectsCollection.aggregate([
      {
        $unwind: "$members"  // Unwind the members array to work with individual members
      },
      {
        $group: {
          _id: null,  // Group all data together (no need to group by project)
          totalWillGetAmount: { $sum: "$members.willGetAmount" },  
          totalInvested: { $sum: "$members.amountInvested" },  
          totalPayments: {  // Sum of all payments made by members
            $sum: {
              $reduce: {
                input: "$members.payments",  // Access payments array
                initialValue: 0,
                in: { $add: ["$$value", "$$this.amount"] }  // Add payment amount to the sum
              }
            }
          }
        }
      }
    ]).toArray();

    if (summary.length > 0) {
      return successResponse(summary[0], "Summary Found");
    } else {
      return successResponse({}, "No data found");
    }
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
