import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const { id } = body;

    // Validate the id
    if (!ObjectId.isValid(id)) {
      return serverErrorResponse("Invalid member ID.");
    }

    const db = await dbConnect();
    const projectCollection = db.collection("projects");
    const depositsCollection = db.collection("deposits");
    const membersCollection = db.collection("members");

    // Delete member
    const deleteMemberResult = await membersCollection.deleteOne({ _id: new ObjectId(id) });
    if (deleteMemberResult.deletedCount === 0) {
      return serverErrorResponse("No matching member found to delete.");
    }

    // Delete related deposits
    const deleteDepositsResult = await depositsCollection.deleteMany({ "member.memberId": new ObjectId(id) });

    // Remove member from projects
    const updateProjectsResult = await projectCollection.updateMany(
      {},
      { $pull: { members: { memberId: new ObjectId(id) } } }
    );

    // console.log({
    //   message: "Delete operation completed",
    //   deleteMemberResult,
    //   deleteDepositsResult,
    //   updateProjectsResult,
    // });

    return successResponse(deleteMemberResult, "সফলভাবে ডিলিট করা হয়েছে।");
  } catch (e) {
    console.error("Error during DELETE operation:", e);
    return serverErrorResponse("An error occurred while processing your request.");
  }
};
