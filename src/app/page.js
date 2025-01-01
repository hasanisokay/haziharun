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
import Link from "next/link";

const homePage = async ({ searchParams }) => {
  const startDate = (await searchParams)?.start_date || getStartOfMonth();
  const endDate = (await searchParams)?.end_date || getEndOfMonth();
  let data;
  try {
    const d = await getSummary();
    if (d.status === 200) {
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
      <SummaryCard d={data} />
      <div className="flex justify-center items-center gap-10 mt-4 flex-wrap">
  <div className="flex items-center">
    <Link
      href="/deposits"
      className="text-gray-800 bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      আমানত
    </Link>
    <Link
      href="/deposits/new"
      className="text-gray-800 bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      +
    </Link>
  </div>

  <div className="flex items-center">
    <Link
      href="/members"
      className="text-gray-800 bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      সদস্য
    </Link>
    <Link
      href="/members/new"
      className="text-gray-800 bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      +
    </Link>
  </div>

  <div className="flex items-center">
    <Link
      href="/projects"
      className="text-gray-800 bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      প্রজেক্ট
    </Link>
    <Link
      href="/projects/new"
      className="text-gray-800 bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      +
    </Link>
  </div>
</div>

    </div>
  );
};

export default homePage;
