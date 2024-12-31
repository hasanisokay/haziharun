import PasswordResetForm from "@/components/profile/PasswordResetForm";

const profilePage = () => {
  return (
    <div>
      <PasswordResetForm />
    </div>
  );
};

export default profilePage;

export async function generateMetadata() {
  return {
    title: "প্রোফাইল | হাজী হারুন এন্টারপ্রাইজ",
    description:
      "হাজী হারুন এন্টারপ্রাইজে আপনার অ্যাকাউন্টের প্রোফাইল ম্যানেজ করুন। আপনার ইনভেস্টমেন্ট ম্যানেজমেন্টের তথ্য এবং আপডেট পেতে এখান থেকে শুরু করুন।",
  };
}
