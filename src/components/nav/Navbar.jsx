'use client'
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/slices/themeSlice";
import logOut from "@/utils/logOut.mjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname()
  const route = useRouter();
  const toggleMenu = () => setIsOpen(!isOpen);
  const user = useSelector(state => state.user.userData)
  const handleLogOut = () => {
    logOut()
    route.replace(`/login?redirectTo=${currentPath}`)
  }
  const getLinkClass = (p) => {
    let path = p;
    return path === currentPath
      ? "text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
      : "dark:text-white text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  };
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode)
  const themeSwitch = <button className="px-3 py-2 " onClick={() => dispatch(toggleTheme())}>
    {theme === "dark" ? <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        id="SVGRepo_iconCarrier"
        stroke="#ffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3.32 11.684a9 9 0 0 0 17.357 3.348A9 9 0 0 1 8.32 6.683c0-1.18.23-2.32.644-3.353a9 9 0 0 0-5.645 8.354"
      ></path>
    </svg> : <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <g id="SVGRepo_iconCarrier" fill="#000000">
        <path d="M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0"></path>
        <path
          fillRule="evenodd"
          d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M4.399 4.399a.75.75 0 0 1 1.06 0l.393.392a.75.75 0 0 1-1.06 1.061l-.393-.393a.75.75 0 0 1 0-1.06m15.202 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 0 1-1.06-1.06l.393-.393a.75.75 0 0 1 1.06 0M1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m-2.102 6.148a.75.75 0 0 1 1.06 0l.393.393a.75.75 0 1 1-1.06 1.06l-.393-.393a.75.75 0 0 1 0-1.06m-12.296 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 1 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.061 0M12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>}
  </button>
  return (
    <div className="dark:bg-[#0c0c0e]  sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border shadow-lg">
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8" aria-label="Global">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-white">
                Logo
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/" className={getLinkClass("/")}>হোম</Link>
                <div className={`${currentPath.includes('/deposits')
                  ? "text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  : "dark:text-white text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"}
       flex gap-4 `}>
                  <Link href="/deposits" className="">
                    সঞ্চয়
                  </Link>
                  <Link href="/deposits/new">
                    +
                  </Link>
                </div>
                <div className={`${currentPath.includes('/members')
                  ? "text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  : "dark:text-white text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"}
       flex gap-4 `}>
                  <Link href="/members" className="">
                    সদস্য
                  </Link>
                  <Link href="/members/new">
                    +
                  </Link>
                </div>
                <div className={`${currentPath.includes('/projects')
                  ? "text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  : "dark:text-white text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"}
       flex gap-4 `}>
                  <Link className="text-inherit" href="/projects">
                    প্রজেক্ট
                  </Link>
                  <Link className="text-inherit" href="/projects/new">
                    +
                  </Link>
                </div>
                {user && <button className="dark:text-white text-black px-3 py-2 rounded-md text-sm font-medium" onClick={handleLogOut}>লগ আউট</button>}
                {themeSwitch}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className={getLinkClass("/")}>Home</Link>
          <div className={`${getLinkClass("/members")} ${getLinkClass("/members/new")} flex gap-4 `}>
            <Link href="/members">
              Members
            </Link>
            <Link href="/members/new">
              +
            </Link>
          </div>
          <Link href="/about" className={getLinkClass("/about")}>About</Link>
          <Link href="/services" className={getLinkClass("/services")}>Services</Link>
          <Link href="/contact" className={getLinkClass("/contact")}>Contact</Link>
          {user && <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={handleLogOut}>Log Out</button>}
          {themeSwitch}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
