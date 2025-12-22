import FooterDetails from "@/components/layout/FooterDetails";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram,FaTwitter  ,FaGithub   } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="w-full text-center
            border-t bg-darkgray dark:border-neutral-800 dark:bg-black flex flex-col gap-4 mt-3 py-3"
        >
            <FooterDetails />
            <Separator className={`bg-font`}/>
            <div className={`bg-darkgray flex md:flex-row flex-col justify-between items-center px-9 py-3 gap-y-2`}>
                <h1 className={`text-sm text-font`}>
                    © 2025 <Link className="text-primary logo" href={'/'}>SPORTSW</Link>. All rights reserved.
                </h1>
                <div className={`links flex gap-4 text-2xl`}>
                    <Link href="/">
                        <FaTwitter className={`link-hover`}  />
                    </Link>
                    <Link href="/">
                        <FaInstagram className={`link-hover`}/>
                    </Link>
                    <Link href="/">
                        <FaFacebook className={`link-hover`}/>
                    </Link>
                    <Link href="/">
                        <FaGithub className={`link-hover`}/>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
