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
export async function generateMetadata() {
  return {
    title: "নতুন প্রকল্প | হাজী হারুন এন্টারপ্রাইজ",
    description: "হাজী হারুন এন্টারপ্রাইজের নতুন প্রকল্প যা আমাদের ইনভেস্টমেন্ট ম্যানেজমেন্ট দক্ষতা এবং ভবিষ্যতের আর্থিক প্রবৃদ্ধির দিকে আমাদের প্রতিশ্রুতি প্রদর্শন করে।",
  };
}
