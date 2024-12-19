
import hostname from "@/constants/hostname.mjs";

const getDeposits =async (page,limit,sort,keyword, filter) => {
    const host = await hostname();
    const res = await fetch(`${host}/api/gets/deposits?page=${page}&&limit=${limit}&&sort=${sort}&&keyword=${keyword}&&filter=${filter}`,{
        credentials: 'include'
    });
    const data = await res.json();
    return data;
};

export default getDeposits;