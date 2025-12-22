import React from 'react';
import HeroPage from "@/components/Home/HeroPage";
import BrandsSlider from "@/components/Home/BrandsSlider";
import HomeTap from "@/components/Home/HomeTap";
import Blogsection from "@/components/Home/Blogsection";
import { Separator } from "@/components/ui/separator";

const Home = () => {


    return (
        <section >
            <HeroPage />
            <div >
                <HomeTap />
                <Separator className={`bg-mutedgray my-2`}/>

                <Blogsection/>
                <Separator className={`bg-mutedgray my-2`}/>
                <BrandsSlider />
            </div>
        </section>
    )
}
export default Home;