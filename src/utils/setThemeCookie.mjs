"use server";

import { THEME_COOKIE } from "@/constants/constantNames.mjs";
import { cookies } from "next/headers";

const setThemeCookie = (theme) => {
  cookies().set({
    name: THEME_COOKIE,
    value: theme,
    maxAge: 24 * 60 * 60 * 365,
  });
};

export default setThemeCookie;
