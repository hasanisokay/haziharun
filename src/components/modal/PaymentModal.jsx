'use client'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import CustomDatePicker from "../datepicker/DatePicker";

const PaymentModal = ({ isOpen, onClose, members, onSubmit }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date());

  const theme = useSelector((state) => state.theme.mode);

  // Set default selected member and payment amount
  useEffect(() => {
    if (members && members.length > 0) {
      setSelectedMember({
        value: members[0].memberId,
        label: members[0].name,
      });
      setPaymentAmount(members[0].willGetAmount || 0);
    }
  }, [members]);

  const handleMemberChange = (selectedOption) => {
    const member = members.find((m) => m.memberId === selectedOption.value);
    setSelectedMember(selectedOption);
    setPaymentAmount(member?.willGetAmount || 0);
  };

  const handlePaymentChange = (event) => {
    setPaymentAmount(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedMember) {
      onSubmit(selectedMember.value, paymentAmount, paymentDate);
    }
  };

  if (!isOpen) return null;

  // React Select custom styles for light and dark modes
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

  // Options for React Select
  const options = members.map((member) => ({
    value: member.memberId,
    label: member.name,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          পেমেন্ট করুন
        </h2>

        {/* Member Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            সদস্য নির্বাচন করুনঃ
          </label>
          <Select
            value={selectedMember}
            onChange={handleMemberChange}
            options={options}
            styles={customStyles}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            তারিখঃ
          </label>
          <CustomDatePicker width={"100%"} showDateIcon={false} classNames={'bg-inherit'} defaultValue={paymentDate} onDateChange={(e) => setPaymentDate(e)} />
        </div>

        {/* Payment Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            পরিমাণঃ
          </label>
          <input
            type="number"
            value={paymentAmount}
            onChange={handlePaymentChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            বাতিল
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            জমা দিন
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
