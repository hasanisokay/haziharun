import NewProjectForm from "@/components/projects/NewProjectForm";

const newMemberPage = async ({ searchParams }) => {
  const id = (await searchParams).id;
  return (
    <div>
      <NewProjectForm id={id} />
    </div>
  );
};

export default newMemberPage;
