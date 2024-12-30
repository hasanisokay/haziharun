import NewMemberForm from '@/components/members/NewMember';


const newMemberPage = async({searchParams}) => {
    const id = (await searchParams).id;
    return (
        <div>
              <NewMemberForm id={id}/>
        </div>
    );
};

export default newMemberPage;

export async function generateMetadata() {
    return {
      title: "নতুন সদস্য যোগ করুন | হাজী হারুন এন্টারপ্রাইজ",
      description: "নতুন সদস্যদের যোগদান করুন হাজী হারুন এন্টারপ্রাইজে এবং আমাদের সাফল্য এবং ভবিষ্যতের উন্নয়নে অংশ নিন।",
    };
  }
  