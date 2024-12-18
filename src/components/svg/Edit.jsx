'use client'

import { useSelector } from "react-redux";

const Edit = () => {
    const theme = useSelector(state => state.theme.mode)
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
      >
        <g
          id="SVGRepo_iconCarrier"
          stroke={theme==="light"?"#000":"#ffff"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="m21.28 6.4-9.54 9.54c-.95.95-3.77 1.39-4.4.76s-.2-3.45.75-4.4l9.55-9.55a2.58 2.58 0 1 1 3.64 3.65"></path>
          <path d="M11 4H6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h11c2.21 0 3-1.8 3-4v-5"></path>
        </g>
      </svg>
    );
};

export default Edit;
