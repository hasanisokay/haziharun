import NewDeposit from "@/components/deposits/NewDeposit";

const newDepositPage = () => {
    return (
        <div>
            <NewDeposit />
        </div>
    );
};

export default newDepositPage;

export async function generateMetadata() {
    return {
      title: "নতুন আমানত | হাজী হারুন এন্টারপ্রাইজ",
      description: "নতুন ডিপোজিট করতে এখানে আসুন এবং আপনার বিনিয়োগের জন্য একটি নিরাপদ এবং লাভজনক পথ শুরু করুন।",
    };
  }
  