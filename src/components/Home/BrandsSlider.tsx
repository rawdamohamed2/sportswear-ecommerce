import React from 'react';
import Image from "next/image";
import nike from "../../../public/images/Nike.png"
import Adidas from "../../../public/images/adidas.png"
import Puma from "../../../public/images/Puma.png"
import Reebok from "../../../public/images/Reebok.png"
const BrandsSlider = () => {
    return (
        <>
            <div className={`container mx-auto grid md:grid-cols-4 grid-cols-1 gap-0 py-4`}>
                <Image src={nike} alt={'nike logo'}  className={`w-[300px] h-[100px]`}/>
                <Image src={Adidas} alt={'Adidas logo'} className={`w-[300px] h-[100px]`}/>
                <Image src={Puma} alt={'Puma logo'} className={`w-[300px] h-[100px]`}/>
                <Image src={Reebok} alt={'Reebok logo'} className={`w-[300px] h-[100px]`}/>
            </div>

        </>

    )
}
export default BrandsSlider;
