import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./navbar/Navbar";
import CreateJobHeader from "./createJobHeader/CreateJobHeader";
import EditJobHeader from "./editJobHeader/EditJobHeader";

const whiteLogo = require("@/public/logos/logo-white.svg") as string;

export default async function Header() {
  // TEMPORARY
  const session = true;
  const isStudent = false;

  return (
    <div>
      <div className="flex justify-between items-center py-4 pl-3 pr-5 md:pr-10">
        <Link href="/landing">
          <Image
            className="w-auto h-auto md:w-36"
            src={whiteLogo}
            alt="logo"
            width={110}
            height={110}
          />
        </Link>
        <Navbar session={session} isStudent={isStudent} />
      </div>
      <CreateJobHeader />
      <EditJobHeader />
    </div>
  );
}