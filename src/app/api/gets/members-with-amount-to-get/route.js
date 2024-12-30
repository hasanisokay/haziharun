import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    const membersCollection = db.collection("members");
    const projectsCollection = db.collection("projects");

    // Perform aggregation to calculate totals
    const membersWithProjects = await membersCollection
      .aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "members.memberId",
            as: "projects",
          },
        },
        {
          $addFields: {
            totalInvested: {
              $sum: {
                $map: {
                  input: "$projects",
                  as: "project",
                  in: {
                    $sum: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$$project.members",
                            as: "member",
                            cond: { $eq: ["$$member.memberId", "$_id"] },
                          },
                        },
                        as: "member",
                        in: "$$member.amountInvested",
                      },
                    },
                  },
                },
              },
            },
            totalExpected: {
              $sum: {
                $map: {
                  input: "$projects",
                  as: "project",
                  in: {
                    $sum: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$$project.members",
                            as: "member",
                            cond: { $eq: ["$$member.memberId", "$_id"] },
                          },
                        },
                        as: "member",
                        in: "$$member.willGetAmount",
                      },
                    },
                  },
                },
              },
            },
            totalReceived: {
              $sum: {
                $map: {
                  input: "$projects",
                  as: "project",
                  in: {
                    $sum: {
                      $map: {
                        input: {
                          $reduce: {
                            input: {
                              $filter: {
                                input: "$$project.members",
                                as: "member",
                                cond: { $eq: ["$$member.memberId", "$_id"] },
                              },
                            },
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this.payments"] },
                          },
                        },
                        as: "payment",
                        in: "$$payment.amount",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            projects: 0, // Exclude the projects array to reduce payload size
          },
        },
      ])
      .toArray();

    return successResponse({ members: membersWithProjects }, "Members Found");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
