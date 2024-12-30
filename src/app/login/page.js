import LoginForm from '@/components/forms/LoginForm';

const loginPage = async ({ searchParams }) => {
    const search = await searchParams;
    const redirectTo = search?.redirectTo || "/";

    return (
        <div>
            <LoginForm redirectTo={redirectTo} />
        </div>
    );
};

export default loginPage;

export async function generateMetadata() {
    return {
      title: "লগইন | হাজী হারুন এন্টারপ্রাইজ",
      description: "হাজী হারুন এন্টারপ্রাইজে আপনার অ্যাকাউন্টে প্রবেশ করতে লগইন করুন। আপনার ইনভেস্টমেন্ট ম্যানেজমেন্টের তথ্য এবং আপডেট পেতে এখান থেকে শুরু করুন।",
    };
  }
  