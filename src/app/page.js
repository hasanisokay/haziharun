import CurrentProjects from "@/components/homepage/CurrentProjects";
import Home from "@/components/homepage/Home";
import TotalMembers from "@/components/homepage/TotalMembers";
import NotFound from "@/components/not-found/NotFound";
import getDepositStats from "@/utils/getDepositStats.mjs";
import getEndOfMonth from "@/utils/getEndOfMonth.mjs";
import getProjects from "@/utils/getProjects.mjs";
import getStartOfMonth from "@/utils/getStartOfMonth.mjs";

const homePage = async ({ searchParams }) => {
  const startDate = (await searchParams)?.start_date || getStartOfMonth();
  const endDate = (await searchParams)?.end_date || getEndOfMonth();
  let deposits;
  let projects;
  try {
    const d = await getDepositStats(startDate, endDate);
    const c = await getProjects(1, 10000, '', '', '', true);

    if (c.status === 200) {
      projects = c?.data?.projects;
    }
    if (d.status === 200) {
      deposits = d?.data;
    }
  } catch (error) {
    console.error(error);
    deposits = null;
    projects = null;
  }

  if (!deposits) return <NotFound />;
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <CurrentProjects p={projects} />
      <TotalMembers />
      <Home d={deposits}/>
    </div>
  );
};




export default homePage;
