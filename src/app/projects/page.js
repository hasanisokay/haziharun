import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import ProjectList from "@/components/projects/ProjectList";
import getProjects from "@/utils/getProjects.mjs";

const projectsPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const filter = (await searchParams)?.filter || "";
  const keyword = (await searchParams)?.keyword || "";
  let projects;
  let totalCount;

  try {
    const d = await getProjects(page, limit, sort, keyword, filter);
    if (d.status === 200) {
      projects = d?.data?.projects;
      totalCount = d?.data?.totalCount || 0;

    }
  } catch (error) {
    console.error(error);
    projects = null;
  }
  const totalPages = Math.ceil(totalCount / limit);

  if (!projects) return <NotFound />;
  return (
    <>
      <ProjectList p={projects} />
      {totalCount > limit && <PaginationDefault p={page} totalPages={totalPages}/>}
    </>
  );
};
export default projectsPage;

export async function generateMetadata() {
  return {
    title: "প্রকল্পসমূহ | হাজী হারুন এন্টারপ্রাইজ",
    description: "হাজী হারুন এন্টারপ্রাইজের সফল প্রকল্পসমূহের সংগ্রহ, যা আমাদের শক্তিশালী ইনভেস্টমেন্ট ম্যানেজমেন্ট দক্ষতা এবং প্রফেশনালিজমকে প্রতিফলিত করে।",
  };
}
