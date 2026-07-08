import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import HeroImg from "../assets/hero.png"

function IndexPage() {
    return (

        <>
            <div className="h-full relative ">
                <div className="absolute left-200 items-end items-center flex flex-col md:bottom-50 top-50">
                    <p className="text-right mb-10 max-w-150  text-white font-display text-7xl "> One Marketplace, Any Job, Any place</p>
                    <p className="text-right mb-10 max-w-130  text-white font-poppins text-xl"> Connect with trusted freelancers and local
                        service providers for every task, big or small.</p>
                    <form className="relative w-150">
                        <input type="text" className=" border-white border-1 border-solid rounded-full w-150 text-lg py-3 px-5 bg-white placeholder-gray-300"
                            placeholder="What are you looking for?"></input>
                            <button className="btn absolute right-1 top-1 bottom-1 mr-2 px-6 font-poppins bg-black rounded-full text-white"
                            name="search"> Search ❯❯</button>
                    </form>
                </div>
                <img src={HeroImg} className="max-h-full max-w-full select-none " alt="hero image"></img>
            </div>
            aaaa <br></br>
            aaaa <br></br>
        </>
    );
}

export default IndexPage;