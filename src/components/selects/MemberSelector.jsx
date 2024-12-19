'use client'
import generateUniqueIds from "@/utils/generateUniqueIds.mjs";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const MemberSelector = ({ onChange, placeholder, id, width, clearSelection, permanentMembersOnly=false}) => {
  const [membersList, setMembersList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const theme = useSelector((state) => state.theme.mode);
  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/gets/members?fields=_id,name,type');
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
    onChange({ name: s.label, _id: s.value });
  };
  useEffect(() => {
    if (clearSelection) {
      setSelectedOption(null);
    }
  }, [clearSelection]);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
      borderColor: state.isFocused ? "#2563EB" : theme === "dark" ? "#4B5563" : "#D1D5DB",
      color: theme === "dark" ? "#F9FAFB" : "#1F2937",
      boxShadow: state.isFocused ? "0 0 0 1px #2563EB" : "none",
      "&:hover": {
        borderColor: theme === "dark" ? "#9CA3AF" : "#6B7280",
        backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
      color: theme === "dark" ? "#F9FAFB" : "#1F2937",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "#374151"
          : "#E5E7EB"
        : "transparent",
      color: state.isFocused
        ? theme === "dark"
          ? "#F9FAFB"
          : "#1F2937"
        : theme === "dark"
          ? "#D1D5DB"
          : "#4B5563",
      "&:hover": {
        backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
        color: theme === "dark" ? "#F9FAFB" : "#1F2937",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#F9FAFB" : "#1F2937",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#9CA3AF" : "#6B7280",
      "&:hover": {
        color: theme === "dark" ? "#F3F4F6" : "#4B5563",
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
    }),
  };


  const memberOptions = useMemo(() => {
    if (permanentMembersOnly) {
      return membersList?.filter(m => m.type === "permanent")?.map((member) => ({
        value: member._id,
        label: member.name,
      }));
    } else {
      return membersList?.map((member) => ({
        value: member._id,
        label: member.name,
      }));
    }
  }, [membersList,permanentMembersOnly]);

  return (
    <div style={{ width: width || "300px" }}>
      <Select
        value={selectedOption}
        options={memberOptions}
        onChange={handleSelection}
        placeholder={placeholder || "Select or search members"}
        className={`w-full text-black `}
        styles={customStyles}
        instanceId={"2111" || id || generateUniqueIds(1)}
      />
    </div>
  );
};

export default MemberSelector;
