import hostname from "@/constants/hostname.mjs";

const getSummary = async () => {
  const host = await hostname();
  const response = await fetch(`${host}/api/gets/summary`);
  const data = await response.json();
  return data;
};

export default getSummary;
