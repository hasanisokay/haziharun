import React, { useEffect, useState } from "react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
const CustomDatePicker = ({ showDateIcon = true, onDateChange, placeholder, width, defaultValue, classNames }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (defaultValue) {
            setSelectedDate(new Date(defaultValue));
        } else {
            setSelectedDate(new Date());
        }
    }, [defaultValue]);

    const handleChange = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    return (
        <div style={{ width: width || "100%" }} className={`${classNames} custom-date-picker`}>
            {showDateIcon ? (
                <DatePicker
                    value={selectedDate}
                    onChange={handleChange}
                    format="dd/MM/yyyy"
                    className={classNames}
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    placeholder={placeholder || "Select a Date"}
                    calendarIcon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 48 48"
                        >
                            <mask id="ipSApplication0">
                                <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                                    <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                                    <path
                                        fill="#fff"
                                        d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                                    ></path>
                                </g>
                            </mask>
                            <path
                                fill="currentColor"
                                d="M0 0h48v48H0z"
                                mask="url(#ipSApplication0)"
                            ></path>
                        </svg>
                    }
                />
            ) : (
                <DatePicker
                    value={selectedDate}
                    onChange={handleChange}
                    format="dd/MM/yyyy"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    className={classNames}
                    placeholder={placeholder || "Select a Date"}
                />
            )}
        </div>
    );
};

export default CustomDatePicker;
