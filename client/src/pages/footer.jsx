import Logo from "../assets/sew2.png";
import Fb from "../assets/facebook.png";
import Ln from "../assets/linkedin.png";
import Ig from "../assets/instagram.png";
import Twt from "../assets/twitter.png";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="flex-col justify-center items-center inset-shadow-sm px-50 pb-5">
            <div className="flex justify-center items-center max-h-auto">
                <div className="pb-10 max-w-125">
                    <img src={Logo} alt="SewaMandala Logo" className="max-w-80"></img>
                    <p className="mx-6 text-gray-700">Connecting clients with verified, trusted service providers across Nepal
                        - physical and digital services, all in one reliable marketplace.</p>
                </div>

                <ul className="flex justify-center items-center px-5 ">
                    <li className="fNavLi"> <p className="font-semibold pb-10">Quick Links </p>
                        <ul>
                            <li className="fNavLink"> Home </li>
                            <li className="fNavLink"> Explore </li>
                            <li className="fNavLink"> Our Services </li>
                            <li className="fNavLink"> Our team </li>
                        </ul>
                    </li>
                    <li className="fNavLi font-semibold"> Contact us</li>
                </ul>
            </div>

            <div className=" flex justify-between items-center border-solid border-gray-400 border-solid border-t-2 ">
                <p className="mx-6 mt-3 text-xs text-gray-600"> &copy; 2026 SewaMandala. All rights reserved.</p>
                <div className="flex justify-between mt-3 ">
                    <div className="fNavLogo">
                        <img src={Fb} alt="Facebook" className="max-w-6  "></img>
                    </div>
                    <div className="fNavLogo">
                        <img src={Ln} alt="Linkedin" className="max-w-6 "></img>
                    </div>
                    <div className="fNavLogo">
                        <img src={Ig} alt="Facebook" className="max-w-6"></img>
                    </div>
                    <div className="fNavLogo">
                        <img src={Twt} alt="Twitter" className="max-w-6"></img>
                    </div>
                </div>
                <div>
                    <p className="mx-6 mt-3 text-sm cursor-pointer text-gray-800"> ↑ Top</p>  {/* href to top of page left */}
                </div>
            </div>
        </div>



    )
}

export default Footer;