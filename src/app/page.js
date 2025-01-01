// import CurrentProjects from "@/components/homepage/CurrentProjects";
// import Home from "@/components/homepage/Home";
import SummaryCard from "@/components/homepage/SummaryCard";
// import TotalMembers from "@/components/homepage/TotalMembers";
import NotFound from "@/components/not-found/NotFound";
// import getDepositStats from "@/utils/getDepositStats.mjs";
import getEndOfMonth from "@/utils/getEndOfMonth.mjs";
// import getProjects from "@/utils/getProjects.mjs";
import getStartOfMonth from "@/utils/getStartOfMonth.mjs";
import getSummary from "@/utils/getSummary.mjs";

const homePage = async ({ searchParams }) => {
  const startDate = (await searchParams)?.start_date || getStartOfMonth();
  const endDate = (await searchParams)?.end_date || getEndOfMonth();
  let data;
  try {
    const d = await getSummary();
    if(d.status===200){
      data = d.data;
    }
  } catch (error) {
    console.error(error);
    deposits = null;
    projects = null;
  }

  if (!data) return <NotFound />;
  return (
    <div className="min-h-[calc(100vh-96px)]">
      <SummaryCard d={data}/>
    </div>
  );
};

export default homePage;
