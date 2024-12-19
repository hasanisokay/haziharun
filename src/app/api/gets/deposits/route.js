import {
    serverErrorResponse,
    successResponse,
  } from "@/constants/routeResponses.mjs";
  import dbConnect from "@/services/dbConnect.mjs";
  
  export const GET = async (req) => {
    try {
      const db = await dbConnect();
      const searchParams = req.nextUrl.searchParams;
      const keyword = searchParams.get("keyword");
      const sort = searchParams.get("sort");
      const filter = searchParams.get("filter");
      const page = parseInt(searchParams.get("page"));
      const limit = parseInt(searchParams.get("limit")) || 10;
      const skip = (page - 1) * limit;
      const matchStage = {};
      let sortStage = { addedOn: -1 };

      if (filter === "permanent_members_only") {
        matchStage.type = "permanent";
      } else if (filter === "temporary_members_only") {
        matchStage.type = "temporary";
      }
      if (sort === "name_asc") {
        sortStage = { name: 1 };
      } else if (sort === "name_desc") {
        sortStage = { name: -1 };
      } else if (sort === "newest") {
        sortStage = { addedOn: -1 };
      } else if (sort === "oldest") {
        sortStage = { addedOn: 1 };
      }
  
      if (keyword) {
        matchStage.$or = [
          { 'member.name': { $regex: keyword, $options: "i" } },
        ];
      }
  
      const depositCollection = db.collection("deposits");
      const deposits = await depositCollection.find(matchStage).toArray();
      const totalCount = await depositCollection.countDocuments(matchStage);
  
      return successResponse({ deposits, totalCount }, "Members Found");
    } catch (e) {
      console.error(e);
      return serverErrorResponse(e.message);
    }
  };
  