
import hostname from "@/constants/hostname.mjs";

const getDeposits =async (page,limit,sort,keyword, filter, startDate, endDate) => {
    const host = await hostname();
    const res = await fetch(`${host}/api/gets/deposits?page=${page}&&limit=${limit}&&sort=${sort}&&keyword=${keyword}&&filter=${filter}&&start_date=${startDate}&&end_date=${endDate}`,{
        credentials: 'include'
    });
    const data = await res.json();
    return data;
};

export default getDeposits;