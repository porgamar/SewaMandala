import Logo from "../assets/sew2.png";
import Fb from "../assets/facebook.png";
import Ln from "../assets/linkedin.png";
import Ig from "../assets/instagram.png";
import Twt from "../assets/twitter.png";
import Call from "../assets/call.png";
import Mail from "../assets/email.png";
import Add from "../assets/location.png";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pt-10 sm:pt-12 md:pt-14 pb-6 inset-shadow-sm">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-10 text-center md:text-left">

                <div className="flex flex-col items-center md:items-start w-full md:w-2/5">
                    <img src={Logo} alt="SewaMandala Logo" className="w-40 sm:w-48 md:w-56"></img>
                    <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-xs md:max-w-sm">
                        Connecting clients with verified, trusted service providers across Nepal — physical and digital services, all in one reliable marketplace.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-2/4 justify-center md:justify-between gap-8 sm:gap-10">

                    {/* Quick links column */}
                    <div className="flex flex-col items-center md:items-start">
                        <p className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</p>
                        <ul className="flex flex-col gap-2 sm:gap-3">
                            <li className="fNavLink text-sm sm:text-base"> <Link to="/">Home</Link> </li>
                            <li className="fNavLink text-sm sm:text-base"> <Link to="/Explore">Explore</Link> </li>
                            <li className="fNavLink text-sm sm:text-base"> <Link to="/Services">Our Services</Link> </li>
                            <li className="fNavLink text-sm sm:text-base"> <Link to="/OurTeam">Our team</Link> </li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <p className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Contact us</p>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm sm:text-base">
                                <img src={Mail} className="w-4 sm:w-4.5 shrink-0"></img>
                                <span>support@sewamandala.com.np</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm sm:text-base">
                                <img src={Add} className="w-4 sm:w-4.5 shrink-0"></img>
                                <span>New-Baneshwor, Kathmandu</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm sm:text-base">
                                <img src={Call} className="w-4 sm:w-4.5 shrink-0"></img>
                                <span>+977-9860331669, 9803422032</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 sm:mt-10 pt-4 border-t-2 border-gray-400 border-solid
                flex flex-col sm:flex-row items-center justify-between gap-4">

                <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                    &copy; 2026 SewaMandala. All rights reserved.
                </p>

                <div className="flex items-center gap-4 sm:gap-5 order-1 sm:order-2">
                    <img src={Fb} alt="Facebook" className="w-5 sm:w-6 hover:opacity-70 cursor-pointer"></img>
                    <img src={Ln} alt="Linkedin" className="w-5 sm:w-6 hover:opacity-70 cursor-pointer"></img>
                    <img src={Ig} alt="Instagram" className="w-5 sm:w-6 hover:opacity-70 cursor-pointer"></img>
                    <img src={Twt} alt="Twitter" className="w-5 sm:w-6 hover:opacity-70 cursor-pointer"></img>
                </div>

                <a href="#" className="text-xs sm:text-sm text-gray-800 hover:text-green-600 order-3">
                    ↑ Top
                </a>
            </div>
        </footer>
    )
}

export default Footer;