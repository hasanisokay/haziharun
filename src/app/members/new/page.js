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