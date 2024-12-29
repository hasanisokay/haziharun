import hostname from "@/constants/hostname.mjs";

const getDepositStats = async (start_date, end_date) => {
  const host = await hostname();
  const res = await fetch(
    `${host}/api/gets/deposit-stats?start_date=${start_date}&&end_date=${end_date}`,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  return data;
};

export default getDepositStats;
