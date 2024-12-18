import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import ProjectList from "@/components/projects/ProjectList";
import hostname from "@/constants/hostname.mjs";
import getProjects from "@/utils/getProjects.mjs";

const projectsPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const keyword = (await searchParams)?.keyword || "";
  let projects;
  let totalCount;

  try {
    const d = await getProjects(page, limit, sort, keyword);
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
      <ProjectList projects={projects} />
      {totalCount > limit && <PaginationDefault p={page} totalPages={totalPages}/>}
    </>
  );
};
export default projectsPage;
