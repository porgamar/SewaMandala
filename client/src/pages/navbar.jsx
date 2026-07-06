import Image from "../assets/sewa1.png";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="flex justify-between items-center max-h-40 my-1 mx-25 ">
            <img src={Image} alt="SewaMandala Logo" className="max-w-70" ></img>
            <ul className="flex items-center justify-center">
                <li className="navLi"> <Link to="/">Home</Link> </li>
                <li className="navLi"> <Link to="/Explore">Explore</Link> </li>
                <li className="navLi"> <Link to="/">About Us</Link> </li>
                <li className="navLi"> <Link to="/">Our Team</Link> </li>
            </ul>
            <div>
                <button className="btn py-1 px-5 rounded-lg border-solid border-2 mr-10 border-gray-700 hover:border-green-500 hover:text-green-500">Sign up</button>
                <button className="btn hover:bg-green-600 py-1.5 rounded-lg px-5 bg-green-500 text-white">Log in</button>
            </div>
        </div>

    )
}

export default Navbar;