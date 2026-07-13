import Image from "../assets/sewa1.png";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative z-10 flex justify-between items-center bg-white my-1 px-4 sm:px-6 md:px-10 lg:px-16 xl:mx-25">
            <img src={Image} alt="SewaMandala Logo" className="w-28 sm:w-36 md:w-48 lg:w-56 xl:w-70"></img>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center justify-center gap-2 lg:gap-4">
                <li className="navLi text-sm md:text-base lg:text-lg"> <Link to="/">Home</Link> </li>
                <li className="navLi text-sm md:text-base lg:text-lg"> <Link to="/Explore">Explore</Link> </li>
                <li className="navLi text-sm md:text-base lg:text-lg"> <Link to="/Services">Our Services</Link> </li>
                <li className="navLi text-sm md:text-base lg:text-lg"> <Link to="/OurTeam">Our Team</Link> </li>
            </ul>

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
                <button className="btn text-sm md:text-sm lg:text-base py-1 px-3 md:px-4 lg:px-5 rounded-lg border-solid border-2 border-gray-700 hover:border-green-500 hover:text-green-500">Sign up</button>
                <button className="btn text-sm md:text-sm lg:text-base hover:bg-green-600 py-1.5 rounded-lg px-3 md:px-4 lg:px-5 bg-green-500 text-white">Log in</button>
            </div>

            {/* Mobile hamburger button */}
            <button
                className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 z-50"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className="block h-0.5 w-6 bg-gray-800 transition-transform duration-300 "></span>
                <span className="block h-0.5 w-6 bg-gray-800 transition-opacity duration-300 "></span>
                <span className="block h-0.5 w-6 bg-gray-800 transition-transform duration-300 "></span>
            </button>

            {/* Mobile backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            {/* Mobile side drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-56 sm:w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden
                ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col p-5 sm:p-6 gap-5 sm:gap-6">
                    <button
                        className="self-end text-xl sm:text-2xl text-gray-600"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                    <ul className="flex flex-col gap-4 sm:gap-5 text-base sm:text-lg">
                        <li className="navLi"> <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link> </li>
                        <li className="navLi"> <Link to="/Explore" onClick={() => setMenuOpen(false)}>Explore</Link> </li>
                        <li className="navLi"> <Link to="/Services" onClick={() => setMenuOpen(false)}>Our Services</Link> </li>
                        <li className="navLi"> <Link to="/OurTeam" onClick={() => setMenuOpen(false)}>Our Team</Link> </li>
                    </ul>
                    <div className="flex flex-col gap-3 mt-4">
                        <button className="btn text-sm sm:text-base py-2 px-5 rounded-lg border-solid border-2 border-gray-700 hover:border-green-500 hover:text-green-500">Sign up</button>
                        <button className="btn text-sm sm:text-base hover:bg-green-600 py-2 rounded-lg px-5 bg-green-500 text-white">Log in</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;