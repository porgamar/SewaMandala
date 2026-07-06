import React from "react";
import Navbar from "./navbar";
import HeroImg from "../assets/hero.png"

function IndexPage(){
    return (
        
        <>
        <div className="h-full relative ">
            <div>
                <p className="absolute text-white font-display text-6xl left-130 md:bottom-50 bottom-100 "> One Marketplace, Any Job, Any place</p>
            </div>
            <img  src={HeroImg} className="max-h-full max-w-full " alt="hero image"></img>
        </div>
        </>
    );
}

export default IndexPage;