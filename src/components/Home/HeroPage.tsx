'use client'
import React from 'react'
import Image from "next/image";
import hero1 from "../../../public/images/hero3.jpg";
import Link from "next/link";
import { IoChatbubbles } from "react-icons/io5";
const HeroPage = () => {
    return (
        <div className={`md:mt-0 mt-[68px] grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 min-h-dvh`}>
            <div className="hero lg:col-span-2 md:col-span-1 col-span-1 h-full ">
                <div className={`h-full flex flex-col md:justify-end justify-center items-center md:w-95 w-full mx-auto py-5`}>
                    <h1 className="text-center uppercase sm:text-5xl text-4xl font-semibold pb-5">
                        It's your time to step up your game
                    </h1>
                    <Link href="/products" className={`border-b border-font`}>
                        Shop Now
                    </Link>
                </div>
            </div>
            <div className="hero1 md:col-span-1 col-span-1 h-full relative">
                <div className={`h-full flex items-end justify-center`}>
                    <Image src={hero1} alt={`hero image`} className={`w-70 h-80`} />
                </div>
                <Link href={`/contactus`} className={`flex gap-1 justify-center items-center bg-darkgray absolute end-0 bottom-0 px-5 py-3`}>
                    <IoChatbubbles className={`text-primary`}/> Chat With Us!
                </Link>
            </div>
        </div>
    )
}
export default HeroPage
