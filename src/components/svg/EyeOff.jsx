import React from 'react';

const EyeOff = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
        >
            <g
                id="SVGRepo_iconCarrier"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                <path d="M14.83 9.18A4 4 0 0 0 8 12.01a4 4 0 0 0 1.16 2.82M12 16.01a4 4 0 0 0 4-4"></path>
                <path d="M17.61 6.39 6.38 17.62A21.8 21.8 0 0 1 2 11.99c4.71-8.23 10.44-10.1 15.61-5.6M21 3l-3.39 3.39M6.38 17.62 3 21M19.57 8.43A25.3 25.3 0 0 1 22 12.01c-4 7-8.73 9.39-13.23 7.22"></path>
            </g>
        </svg>
    );
};

export default React.memo(EyeOff);