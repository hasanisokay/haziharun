import MembersList from "@/components/members/MembersList";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import getMembersWithDetails from "@/utils/getMembersWithDetails.mjs";


const membersPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const filter = (await searchParams)?.filter || "";
  const keyword = (await searchParams)?.keyword || "";
  let members;
  let totalCount;

  try {
    const d = await getMembersWithDetails(page, limit, sort, keyword, filter);
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

export async function generateMetadata() {
  return {
    title: "সদস্যরা | হাজী হারুন এন্টারপ্রাইজ",
    description: "হাজী হারুন এন্টারপ্রাইজের সদস্যদের একটি তালিকা, যারা আমাদের ইনভেস্টমেন্ট ম্যানেজমেন্ট প্রক্রিয়ায় গুরুত্বপূর্ণ ভূমিকা পালন করেন।",
  };
}
