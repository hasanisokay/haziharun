const jsToExcelDate = (dateString) => {
  if(dateString === null) return "";
  if(dateString === undefined) return "";
  if(dateString === "") return "";
  if(typeof dateString !== "string") return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}` || ""; 
  };
  export default jsToExcelDate;

  
  // const date = new Date(dateString);
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, "0"); 
  // const day = String(date.getDate()).padStart(2, "0");
  // return `${year}-${month}-${day}`