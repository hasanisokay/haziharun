import Home from "@/components/homepage/Home";
import NotFound from "@/components/not-found/NotFound";
import getDepositStats from "@/utils/getDepositStats.mjs";
import getEndOfMonth from "@/utils/getEndOfMonth.mjs";
import getStartOfMonth from "@/utils/getStartOfMonth.mjs";

const homePage = async ({ searchParams }) => {
  const startDate = (await searchParams)?.start_date || getStartOfMonth();
  const endDate = (await searchParams)?.end_date || getEndOfMonth();
  let deposits;
  try {
    const d = await getDepositStats(startDate, endDate);
    if (d.status === 200) {
      deposits = d?.data;
    }
  } catch (error) {
    console.error(error);
    deposits = null;
  }

  if (!deposits) return <NotFound />;
  return (
    <div>
      <Home d={deposits}/>
    </div>
  );
};




export default homePage;
