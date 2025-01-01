import Link from "next/link";
import React from "react";

// Reusable Card Component for displaying each stat
const SummaryCardItem = ({ title, value, bgColor, textColor, href = "/" }) => {
  return (
    <Link href={href}>
      <div className={`flex justify-between items-center px-4 py-2 ${bgColor} rounded-md shadow`}>

        <span className={`font-semibold ${textColor}`}>{title}</span>
        <span className={`font-bold text-xl ${textColor}`}>
          {value.toLocaleString()} {/* Formatting the number */}
        </span>

      </div>
    </Link>
  );
};

const SummaryCard = ({ d }) => {

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
      </div>
    </div>
  );
};

export default SummaryCard;
