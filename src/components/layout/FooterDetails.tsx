'use client'
import React from 'react'
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { IoIosSearch } from "react-icons/io";
import {toast} from "sonner";
const FooterDetails = () => {
    return (
        <div className={`container mx-auto  text-font grid lg:grid-cols-6 md:grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-6`}>
            <div className={`md:text-start text-center md:col-span-2 col-span-1 md:px-4 px-1`}>
                <h1>
                    <Link className="text-4xl text-primary logo " href={'/public'}>SPORTSW</Link>
                </h1>
                <h3 className={` text-3xl font-bold text-font pt-4`}>
                    WE ARE ALL ATHLETES.
                </h3>
                <p className={`text-md font-medium text-font py-2 md:pe-15 pe-0`}>
                    <span className={`logo text-primary`}>SPORTSW </span> is a unisex sportswear shop that blends performance and style, standing for
                    authenticity, resilience, and a culture built different.
                </p>
            </div>
            <div className={`md:text-start text-center col-span-1 md:ps-5 ps-0`}>
                <ul className={`flex gap-1 flex-col`}>
                    <li>
                        <h1 className={`text-xl font-bold text-font py-2`}>
                            Company
                        </h1>
                    </li>
                    <li>
                        <Link href={`/public`} className={`text-font link-hover`}>
                            About us
                        </Link>
                    </li>
                    <li>
                        <Link href={`/public`} className={`text-font link-hover`}>
                            Terminals
                        </Link>
                    </li>
                    <li>
                        <Link href={`/public`} className={`text-font link-hover`}>
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href={`/public`} className={`text-font link-hover`}>
                            Blog
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={`md:text-start text-center col-span-1 md:ps-5 ps-0`}>
                <ul className={`flex gap-1 flex-col`}>
                    <li>
                        <h1 className={`text-xl font-bold text-font py-2`}>
                            SUPPORT
                        </h1>
                    </li>
                    <li>
                        <Link href={`/`} className={`text-font link-hover`}>
                            FAQs
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`} className={`text-font link-hover`}>
                            Customer Support
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`} className={`text-font link-hover`}>
                            Returns Policy
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`} className={`text-font link-hover`}>
                            Privacy Policy
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={`text-start md:col-span-2 col-span-1 sm:px-0 px-5 ps-2`}>
                <h1 className={`text-xl font-bold text-font pb-4`}>Newsletter</h1>
                <div className={`relative `}>
                    <Input className={`bg-font text-darkgray border border-font/40 p-6 focus:outline-primary/40 w-full`} />
                    <IoIosSearch className={`absolute text-[3.1rem] bg-font text-darkgray hover:bg-primary hover:text-font rounded-r-lg p-1 top-0 end-0`} onClick={()=>{
                        toast('message send successfully');
                    }}/>
                </div>

            </div>
        </div>
    )
}
export default FooterDetails;
