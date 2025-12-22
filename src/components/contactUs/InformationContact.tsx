import React from 'react'
import Image from "next/image";

const InformationContact = () => {
    return (
        <div className={`grid col-span-1`}>
            <div className="col-span-1 bg-white w-10/12 mx-auto py-4 rounded-2xl p-8">
                <h1 className={`text-darkgray text-xl px-5 mb-3 `}>Contact details</h1>
                <ul className={`flex flex-col px-8 gap-2 w-full `}>
                    <li className={`text-darkgray text-md font-bold`}>Address: <span className={`text-Fsecondary font-normal`}>20 street , abu salmain</span></li>
                    <li className={`text-darkgray text-md font-bold`}>Phone: <span className={`text-Fsecondary font-normal`}>+20 1117889296</span></li>
                </ul>
                <Image src={`/images/hero1.jpg`} alt={`hero`} width={400} height={100} className={`w-full mx-auto py-3 rounded-xl`}/>
            </div>

        </div>
    )
}
export default InformationContact
