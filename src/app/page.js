import SummaryCard from "@/components/homepage/SummaryCard";
import NotFound from "@/components/not-found/NotFound";
import hostname from "@/constants/hostname.mjs";
import getEndOfMonth from "@/utils/getEndOfMonth.mjs";
import getStartOfMonth from "@/utils/getStartOfMonth.mjs";
import getSummary from "@/utils/getSummary.mjs";


const homePage = async ({ searchParams }) => {
  const startDate = (await searchParams)?.start_date || getStartOfMonth();
  const endDate = (await searchParams)?.end_date || getEndOfMonth();
  let data;
  let paymentsInfo;
  
  try {
    const host  = await hostname();

    const d = await getSummary();
    if (d.status === 200) {
      data = d.data;
    }
    const response = await fetch(`${host}/api/gets/amounts-summary`);
    const responseData = await response.json();
    if (responseData.status === 200) {
      // setAmountsSummary(res?.data);
      paymentsInfo = responseData.data;
    }
  } catch (error) {
    console.error(error);
    deposits = null;
    projects = null;
  }

  if (!data) return <NotFound />;
  return (
    <div className="min-h-[calc(100vh-96px)]">
      <SummaryCard d={data} paymentsInfo={paymentsInfo} />
    </div>
  );
};

export default homePage;
