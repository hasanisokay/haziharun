import Link from "next/link";
import React from "react";

// Reusable Card Component for displaying each stat
const SummaryCardItem = ({ title, value, bgColor, textColor, href = "/" }) => {
  return (
    <Link href={href}>
      <div className={`flex flex-col justify-between items-center px-4 py-2 ${bgColor} rounded-md shadow`}>

        <p className={`font-semibold pb-2 border-b border-b-black w-full text-center ${textColor}`}>{title}</p>
        <p className={`font-bold text-xl pt-2 ${textColor}`}>
          {value.toLocaleString()} {/* Formatting the number */}
        </p>

      </div>
    </Link>
  );
};

const SummaryCard = ({ d, paymentsInfo }) => {

  // Defining reusable color schemes
  const cardStyles = {
    red: {
      bgColor: "bg-red-100 dark:bg-red-600",
      textColor: "text-gray-800 dark:text-gray-200"
    },
    yellow: {
      bgColor: "bg-yellow-100 dark:bg-yellow-600",
      textColor: "text-gray-800 dark:text-gray-200"
    },
    blue: {
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-gray-800 dark:text-gray-200"
    },
    green: {
      bgColor: "bg-green-100 dark:bg-green-700",
      textColor: "text-gray-800 dark:text-gray-200"
    },
    lemon: {
      bgColor: "bg-lime-100 ",
      textColor: "text-gray-800 "
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-4 space-y-4 rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-4">
        {/* Total Members */}
        <SummaryCardItem
          title="মোট সদস্য"
          value={d?.permanentMembers + d?.temporaryMembers || 0}
          bgColor={cardStyles.red.bgColor}
          textColor={cardStyles.red.textColor}
          href="/members"
        />
        {/* Total Projects */}
        <SummaryCardItem
          title="মোট ব্যবসা"
          value={d?.totalProjects || 0}
          bgColor={cardStyles.red.bgColor}
          textColor={cardStyles.red.textColor}
          href="/projects"
        />
        {/* Permanent Members */}
        <SummaryCardItem
          title="আমানতসহ সদস্য"
          value={d?.permanentMembers || 0}
          bgColor={cardStyles.yellow.bgColor}
          textColor={cardStyles.yellow.textColor}
          href="/members?filter=permanent_members_only"
        />
        {/* Finished Projects */}
        <SummaryCardItem
          title="সমাপ্ত হয়েছে"
          value={d?.finishedProjects || 0}
          bgColor={cardStyles.yellow.bgColor}
          textColor={cardStyles.yellow.textColor}
          href="/projects?filter=expired_items_only"
        />
        {/* Temporary Members */}
        <SummaryCardItem
          title="অমানতহীন সদস্য"
          value={d?.temporaryMembers || 0}
          bgColor={cardStyles.blue.bgColor}
          textColor={cardStyles.blue.textColor}
          href="/members?filter=temporary_members_only"
        />
        {/* Running Projects */}
        <SummaryCardItem
          title="চলমান আছে"
          value={d?.runningProjects || 0}
          bgColor={cardStyles.blue.bgColor}
          textColor={cardStyles.blue.textColor}
          href="/projects?filter=active_only"
        />
        {/* Total Amount Invested */}
        <SummaryCardItem
          title="মোট বিনিয়োগ"
          value={d?.totalAmountInvested || 0}
          bgColor={cardStyles.green.bgColor}
          textColor={cardStyles.green.textColor}
          href="/projects"
        />
        {/* Total Profit */}
        <SummaryCardItem
          title="মোট লাভ"
          value={d?.totalProfit || 0}
          bgColor={cardStyles.green.bgColor}
          textColor={cardStyles.green.textColor}
          href="/projects"
        />
        <SummaryCardItem
          title="মোট পেয়েছেন"
          value={paymentsInfo.totalPayments || 0}
          bgColor={cardStyles.lemon.bgColor}
          textColor={cardStyles.lemon.textColor}
          href="/projects"
        />
        <SummaryCardItem
          title="মোট বাকি আছে"
          value={d?.totalAmountInvested+d?.totalProfit- paymentsInfo.totalPayments || 0}
          bgColor={cardStyles.lemon.bgColor}
          textColor={cardStyles.lemon.textColor}
          href="/projects"
        />
        <div className="flex items-center justify-between gap-4 font-semibold text-gray-800 dark:text-gray-200 bg-red-100 dark:bg-red-600 px-4 py-2 rounded-md shadow">
          <Link href="/deposits">আমানত</Link>
          <Link href="/deposits/new">+</Link>
        </div>

        <div className="flex items-center justify-between gap-4 font-semibold text-gray-800 dark:text-gray-200 bg-red-100 dark:bg-red-600  px-4 py-2 rounded-md shadow">
          <Link href="/members">সদস্য</Link>
          <Link href="/members/new">+</Link>
        </div>
        <div className="flex items-center justify-between gap-4 font-semibold text-gray-800 dark:text-gray-200 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-md shadow">
          <Link href="/projects">প্রজেক্ট</Link>
          <Link href="/projects/new">+</Link>
        </div>
      </div>



    </div>
  );
};

export default SummaryCard;
