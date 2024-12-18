'use client'
import generateUniqueIds from "@/utils/generateUniqueIds.mjs";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

const MemberSelector = ({ onChange, placeholder, id, width, clearSelection }) => {
  const [membersList, setMembersList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); 
  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/gets/members?fields=_id,name');
      const data = await res.json();
      if (data.status === 200) {
        setMembersList(data?.data?.members);
      } else {
        console.error("Server error while fetching members:");
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSelection = (s) => {
    setSelectedOption(s)
    onChange({name:s.label, _id:s.value });
  };
  useEffect(() => {
    if (clearSelection) {
      setSelectedOption(null);  
    }
  }, [clearSelection]);

  const memberOptions = useMemo(() => {
    return membersList?.map((member) => ({
      value: member._id,
      label: member.name,
    }));
  }, [membersList]);

  return (
    <div style={{ width: width || "300px" }}>
      <Select
value={selectedOption}
options={memberOptions}
        onChange={handleSelection}
        placeholder={placeholder || "Select or search members"}
        className={`w-full text-black `}
        instanceId={"2111" ||id || generateUniqueIds(1)}
      />
    </div>
  );
};

export default MemberSelector;
