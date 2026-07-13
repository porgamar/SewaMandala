import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import HeroImg from "../assets/hero.png"
import RecPay from "../assets/receiveP.png"
import Pay from "../assets/pay.jpg"
import Accept from "../assets/accept.jpg"
import Browse from "../assets/brws.jpg"
import Create from "../assets/create1.jpg"
import Find from "../assets/findC.png"

import { useState } from "react";
import { Link } from "react-router-dom";

function ToggleBtn({ activeButton, setActiveButton }) {
    return (
        <div className="flex justify-between border border-solid rounded-full border-gray-600 w-full max-w-xs mx-auto sm:mx-0">
            <button
                onClick={() => setActiveButton('hiring')}
                className={`hOptBtn flex-1 ${activeButton === 'hiring'
                    ? ' outline-2 rounded-full outline-solid outline-gray-950'
                    : ' outline-transparent'
                    }`}
            >
                For Hiring
            </button>

            <button
                onClick={() => setActiveButton('finding')}
                className={`hOptBtn flex-1 ${activeButton === 'finding'
                    ? ' outline-2 rounded-full outline-solid outline-gray-950'
                    : ' outline-transparent'
                    }`}
            >
                For Finding Work
            </button>
        </div>
    );
}

function HiringContent() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <li className="homeCard group">
                    <img src={Browse} className="h-40 sm:h-48 md:h-55 w-full rounded-xl shadow-md object-cover" />
                    <p className="pt-5" />Search for desired service
                    <div className="text-sm text-gray-600 h-20 pt-2 opacity-0 group-hover:opacity-100"> Browse through our available services to find the one you need!</div>
                </li>
                <li className="homeCard group">
                    <img src={Accept} className="h-40 sm:h-48 md:h-55 w-full rounded-xl shadow-md object-cover" />
                    <p className="pt-5" />Accept a talent
                    <div className="text-sm text-gray-600 h-20 pt-2 opacity-0 group-hover:opacity-100"> Chat with and accept the required talent!</div>
                </li>
                <li className="homeCard group">
                    <img src={Pay} className="h-40 sm:h-48 md:h-55 w-full rounded-xl shadow-md object-cover" />
                    <p className="pt-5" />Pay after receiving service
                    <div className="text-sm text-gray-600 h-20 pt-2 opacity-0 group-hover:opacity-100"> Make the payment after the service is done</div>
                </li>
            </ul>
        </div>
    )
}

function WOrkingContent() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <li className="homeCard group">
                    <img src={Create} className="h-40 sm:h-48 md:h-55 w-full rounded-xl shadow-md object-cover" />
                    <p className="pt-5" />Create your job listings
                    <div className="text-sm text-gray-600 h-20 pt-2 opacity-0 group-hover:opacity-100"> Create any number of listings of services you provide!</div>
                </li>
                <li className="homeCard group">
                    <img src={Find} className="h-40 sm:h-48 md:h-55 w-full rounded-xl shadow-md object-cover" />
                    <p className="pt-5" />Accept a talent
                    <div className="text-sm text-gray-600 h-20 pt-2 opacity-0 group-hover:opacity-100">Find the right client.</div>
                </li>
                <li className="homeCard group">
                    <img src={RecPay} className="h-40 sm:h-48 md:h-55 w-full rounded-xl shadow-md object-cover" />
                    <p className="pt-5" />Pay after receiving service
                    <div className="text-sm text-gray-600 h-20 pt-2 opacity-0 group-hover:opacity-100"> Receive payment after the service is given.</div>
                </li>
            </ul>
        </div>
    )
}

function IndexPage() {
    const [activeButton, setActiveButton] = useState('hiring')
    return (
        <>
            <div className="relative w-full">
                <img src={HeroImg} className="select-none w-full object-cover" alt="hero image" />
                <div className="absolute inset-0 flex flex-col items-end justify-end sm:justify-center text-right px-4 sm:px-8 md:pr-20 lg:pr-32 py-8">
                    <p className="mb-4 sm:mb-6 md:mb-10 max-w-[90%] sm:max-w-md md:max-w-2xl text-white font-display text-3xl sm:text-5xl md:text-7xl">
                        One Marketplace, Any Job, Any place
                    </p>
                    <p className="mb-4 sm:mb-6 md:mb-10 max-w-[90%] sm:max-w-sm md:max-w-xl text-white font-poppins text-sm sm:text-base md:text-xl">
                        Connect with trusted freelancers and local service providers for every task, big or small.
                    </p>
                    <form className="relative w-full max-w-[90%] sm:max-w-md md:max-w-2xl">
                        <input
                            type="text"
                            className="border-white border border-solid rounded-full w-full text-sm sm:text-base md:text-lg py-2 sm:py-3 pl-4 pr-16 sm:pr-24 bg-white placeholder-gray-300"
                            placeholder="What are you looking for?"
                        />
                        <button
                            className="btn absolute right-1 top-1 bottom-1 px-3 sm:px-6 font-poppins bg-black rounded-full text-white text-xs sm:text-base"
                            name="search"
                        >
                            Search ❯❯
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex flex-col my-10 sm:my-16 md:my-10 items-center px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-2 py-5 w-full max-w-7xl">
                    <p className="text-2xl sm:text-3xl font-semibold font-poppins cursor-default">How it works</p>
                    <ToggleBtn activeButton={activeButton} setActiveButton={setActiveButton} />
                </div>
                <div className="my-8">
                    {activeButton === 'hiring' && <HiringContent />}
                    {activeButton === 'finding' && <WOrkingContent />}
                </div>
            </div>
            <div className="mx-32 rounded-2xl flex flex-col mb-10 items-center bg-linear-to-r from-sky-600 to-green-400">
                <p className="font-poppins text-3xl mt-10 text-center font-semibold text-white">
                    Explore a network of talented professionals ready to help.</p>

                <Link to="/Explore"><button className="mb-10 mt-8 text-md bg-white py-1.5 px-10 rounded-lg hover:opacity-70">Explore talents</button></Link>
            </div>

        </>
    );
}

export default IndexPage;