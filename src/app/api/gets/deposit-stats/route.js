import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    const searchParams = req.nextUrl.searchParams;

    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (!startDate || !endDate) {
      return serverErrorResponse("start_date and end_date are required.");
    }

    const membersCollection = db.collection("members");
    const depositsCollection = db.collection("deposits");

    // Fetch permanent members
    const permanentMembers = await membersCollection
      .find({ type: "permanent" })
      .toArray();

    const memberIds = permanentMembers.map((member) => member._id);

    // Fetch deposits in the date range
    const deposits = await depositsCollection
      .find({
        depositDate: { $gte: new Date(startDate), $lt: new Date(endDate) },
        "member.memberId": { $in: memberIds },
      })
      .toArray();

    // Create a map for member deposits
    const memberDepositMap = deposits.reduce((map, deposit) => {
      const memberId = deposit.member.memberId.toString();
      if (!map[memberId]) {
        map[memberId] = [];
      }
      map[memberId].push({
        amount: deposit.amount,
        depositDate: deposit.depositDate,
      });
      return map;
    }, {});

    // Classify members based on deposits and format data
    const membersWithDeposits = [];
    const membersWithoutDeposits = [];

    permanentMembers.forEach((member) => {
      const memberId = member._id.toString();
      if (memberDepositMap[memberId]) {
        membersWithDeposits.push({
          name: member.name,
          deposits: memberDepositMap[memberId],
        });
      } else {
        membersWithoutDeposits.push({
          name: member.name,
          deposits: [],
        });
      }
    });

    return successResponse(
      {
        membersWithDeposits,
        membersWithoutDeposits,
      },
      "Data Found"
    );
  } catch (e) {
    console.error(e);
    return serverErrorResponse(e.message);
  }
};
