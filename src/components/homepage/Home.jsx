import getEndOfMonth from "@/utils/getEndOfMonth.mjs";
import CustomDateRangePicker from "../selects/DateRangePicker";
import getStartOfMonth from "@/utils/getStartOfMonth.mjs";

const Home = ({ d }) => {
    // Calculate total deposit for all members with deposits
    const totalDeposit = d.membersWithDeposits.reduce((sum, member) => {
        return (
            sum +
            member.deposits.reduce((memberSum, deposit) => memberSum + deposit.amount, 0)
        );
    }, 0);

    return (
        <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                {/* Date Range Picker */}
                <CustomDateRangePicker
                    startDateParam="start_date"
                    endDateParam="end_date"
                    defaultEndDate={getEndOfMonth()}
                    defaultStartDate={getStartOfMonth()}
                />
                <div className="mt-6 text-center text-xl font-bold text-gray-900 dark:text-gray-100">
                    মোট আমানতঃ &#2547; {Number(totalDeposit.toFixed(2)).toLocaleString()}
                </div>
                {/* Members without Deposits */}
                <div className="mt-10">
                    {d.membersWithoutDeposits.length > 0 &&
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            আমানত ছাড়া সদস্য
                        </h2>
                    }

                    <div className="space-y-6">
                        {d.membersWithoutDeposits.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {member.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    এই সময়কালে কোনো আমানত নেই।
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Members with Deposits */}
                <div className="mt-10">
                    {d.membersWithDeposits.length > 0 &&
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            আমানতকারী সদস্য
                        </h2>
                    }
                    <div className="space-y-6">
                        {d.membersWithDeposits.map((member, index) => {
                            const memberTotalDeposit = member.deposits.reduce(
                                (sum, deposit) => sum + deposit.amount,
                                0
                            );
                            return (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                                >
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {member.name}
                                    </h3>
                                    <ul className="mt-4 space-y-2">
                                        {member.deposits.map((deposit, idx) => (
                                            <li
                                                key={idx}
                                                className="flex justify-between items-center text-gray-700 dark:text-gray-300"
                                            >
                                                <span className="font-medium">
                                                    {new Date(deposit.depositDate).toLocaleDateString()}
                                                </span>
                                                <span className="text-green-600 dark:text-green-400 font-semibold">
                                                    &#2547; {deposit.amount.toLocaleString()}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 text-right text-gray-800 dark:text-gray-200 font-semibold">
                                        মোটঃ &#2547; {memberTotalDeposit.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
