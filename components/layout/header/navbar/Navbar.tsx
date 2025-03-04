"use client";

import Link from "next/link";
import Image from "next/image";
import homeIcon from "@/public/icons/home.svg";
import searchIcon from "@/public/icons/search.svg";
import workIcon from "@/public/icons/work.svg";
import NavLink from "./navLink/NavLink";
import NavButton from "./navButton/NavButton";
import homeDarkIcon from "@/public/icons/homeDark.svg";
import searchDarkIcon from "@/public/icons/searchDark.svg";
import workDarkIcon from "@/public/icons/workDark.svg";
import noavatar from "@/public/icons/noavatar.svg";
import person from "@/public/icons/person.svg";
import personDark from "@/public/icons/personDark.svg";
import history from "@/public/icons/history.svg";
import historyDark from "@/public/icons/historyDark.svg";
import Sidebar from "./sidebar/Sidebar";
import LogoutLink from "./logoutButton/LogoutButton";
import ChatNavIcon from "@/public/icons/chatNav.svg"
import ChatNavDarkIcon from "@/public/icons/chatNavDark.svg"
import { usePathname } from "next/navigation";

type Props = {
  session: any;
  isStudent: boolean;
  userInfo: string;
  profileImage?: string;
};

export default function Navbar(props: Props) {
  // Authenticated User Info
  const { session, isStudent, userInfo, profileImage } = props;
  let name;
  // If authenticated via google
  if (session?.user.name) {
    name = session.user.name;
  } else {
    // If authenticated via email and password
    name =
      session?.user.salutation +
      session?.user.firstname +
      " " +
      session?.user.lastname;
  }

  // All Links
  const studentLinks = [
    {
      title: "หน้าแรก",
      path: "/landing",
      icon: homeIcon,
      activeIcon: homeDarkIcon,
    },
    {
      title: "ค้นหางาน",
      path: "/search",
      icon: searchIcon,
      activeIcon: searchDarkIcon,
    },
    {
      title: "งานของฉัน",
      path: "/studentjobs",
      icon: workIcon,
      activeIcon: workDarkIcon,
    },
    {
      title: "แชท",
      path: "/chat",
      icon: ChatNavIcon,
      activeIcon: ChatNavDarkIcon,
    },
  ];

  const employerLinks = [
    {
      title: "หน้าแรก",
      path: "/landing",
      icon: homeIcon,
      activeIcon: homeDarkIcon,
    },
    {
      title: "งานของฉัน",
      path: "/jobs",
      icon: workIcon,
      activeIcon: workDarkIcon,
    },
    {
      title: "แชท",
      path: "/chat",
      icon: ChatNavIcon,
      activeIcon: ChatNavDarkIcon,
    },
  ];

  const additionalLink = [
    {
      title: "โปรไฟล์",
      path: `/profile/${session?.user.id}`,
      icon: person,
      activeIcon: personDark,
    },
    {
      title: "ประวัติการเงิน",
      path: "/payment-history",
      icon: history,
      activeIcon: historyDark,
    },
  ];

  // UI Logic
  const pathName = usePathname();
  const isActive = additionalLink.some((link) => link.path === pathName);
  const avatar = profileImage ? profileImage : noavatar;

  return (
    <>
      {!!session ? (
        <>
          {/* With Session */}
          {/* Desktop : Main NavLink */}
          <div className="font-ibm md:flex md:items-center md:text-sm md:gap-1">
            {(isStudent ? studentLinks : employerLinks).map((link) => (
              <NavLink key={"desktop : " + link.title} link={link} />
            ))}
            <div
              className={`flex justify-center items-center pr-3 ${isActive && "md:bg-slate-50 md:rounded-full"}`}
            >
              {/* Desktop : Avatar */}
              <Image
                className="w-[45px] h-[45px] rounded-full p-1 hidden md:block"
                src={avatar}
                alt="avatar"
                width={45}
                height={45}
                style={{
                    objectFit: 'cover',
                }}
              />
              {/* Both : Hamberger Button + Sidebar */}
              <Sidebar name={name} userInfo={userInfo} isDark={isActive} session={session} avatar={avatar}>
                <div className="h-full w-full flex flex-col justify-between">
                  <div className="w-full flex flex-col gap-3 md:hidden">
                    {/* Mobile : Main NavButton */}
                    {(isStudent ? studentLinks : employerLinks).map((link) => (
                      <NavButton key={"mobile : " + link.title} link={link} />
                    ))}
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    {/* Both : Additional NavButton */}
                    {additionalLink.map((link) => (
                      <NavButton key={"all : " + link.title} link={link} />
                    ))}
                    <LogoutLink />
                  </div>
                </div>
              </Sidebar>
            </div>
          </div>
        </>
      ) : (
        // Both With no session
        <div className="flex items-center gap-4 text-xs font-ibm md:gap-7 md:text-sm">
          <button className="bg-slate-50 px-3 py-2 rounded-md active:opacity-40">
            <Link href="/login" className="text-slate-800 font-bold">
              เข้าสู่ระบบ
            </Link>
          </button>
          <button>
            <Link href="/register" className="text-slate-50 active:opacity-40">
              สมัครเป็นนิสิต
            </Link>
          </button>
        </div>
      )}
    </>
  );
}
