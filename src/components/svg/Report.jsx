'use client'
import { useSelector } from "react-redux";

const Report = () => {
    const theme = useSelector(state => state.theme.mode)
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="icon"
            width="24"
            height="24"
            // fill="#000"
            fill={theme==="light"?"#000":"#ffff"}
            viewBox="0 0 32 32"
        >
            <g id="SVGRepo_iconCarrier">
                <path d="M10 18h8v2h-8zM10 13h12v2H10zM10 23h5v2h-5z"></path>
                <path d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"></path>
                <path
                    id="_Transparent_Rectangle_"
                    fill="none"
                    d="M0 0h32v32H0z"
                    data-name="&lt;Transparent Rectangle&gt;"
                ></path>
            </g>
        </svg>
    );
};

export default Report;