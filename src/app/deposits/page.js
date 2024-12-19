import Deposits from "@/components/deposits/Deposits";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import getDeposits from "@/utils/getDeposits.mjs";


const depositsPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 1000000000;
  const sort = (await searchParams)?.sort || "newest";
  const filter = (await searchParams)?.filter || "";
  const keyword = (await searchParams)?.keyword || "";
  let deposits;
  let totalCount;

  try {
    const d = await getDeposits(page, limit, sort, keyword, filter);
    if (d.status === 200) {
      deposits = d?.data?.deposits;
      totalCount = d?.data?.totalCount || 0;
    }
  } catch (error) {
    console.error(error);
    deposits = null;
  }
  const totalPages = Math.ceil(totalCount / limit);

  if (!deposits) return <NotFound />;
  return (
    <>
      <Deposits d={deposits} />
      {totalCount > limit && (
        <PaginationDefault p={page} totalPages={totalPages} />
      )}
    </>
  );
};
export default depositsPage;
