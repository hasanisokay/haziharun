import { useSelector } from "react-redux";


const Up = () => {
    const theme = useSelector((state) => state.theme.mode);
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="Layer_1"
        width="12"
        height="12"
        fill={theme === "dark" ? "#F9FAFB" : "#1F2937"}
        version="1.1"
        viewBox="0 0 330 330"
    >
        <g id="SVGRepo_iconCarrier">
            <path
                id="XMLID_224_"
                d="m325.606 229.393-150.004-150a14.997 14.997 0 0 0-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.95 14.95 0 0 0 315 255a14.95 14.95 0 0 0 10.607-4.394c5.857-5.858 5.857-15.355-.001-21.213"
            ></path>
        </g>
    </svg>
    );
};

export default Up;