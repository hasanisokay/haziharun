
const getEndOfMonth = () => {
    const now = new Date();
    const lastDayCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );
    return lastDayCurrentMonth.toISOString().split("T")[0];
  };
  export default getEndOfMonth;