import MembersList from "@/components/members/MembersList";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import getMembersWithDetails from "@/utils/getMembersWithDetails.mjs";


const membersPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const keyword = (await searchParams)?.keyword || "";
  let members;
  let totalCount;

  try {
    const d = await getMembersWithDetails(page, limit, sort, keyword);
    if (d.status === 200) {
      members = d?.data?.members;
      totalCount = d?.data?.totalCount || 0;
    }
  } catch (error) {
    console.error(error);
    members = null;
  }
  const totalPages = Math.ceil(totalCount / limit);

  if (!members) return <NotFound />;
  return (
    <>
      <MembersList m={members} />
      {totalCount > limit && (
        <PaginationDefault p={page} totalPages={totalPages} />
      )}
    </>
  );
};
export default membersPage;
