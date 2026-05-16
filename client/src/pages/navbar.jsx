import Image from "../assets/sewa1.png"

function Navbar() {
    return (
        <div class="flex justify-between items-center max-h-40 mt-4 mx-25">
            <a href="home.jsx"><img src={Image} alt="SewaMandala Logo" class="max-w-70" ></img></a>
            <ul class="flex items-center justify-center">
                <li class="navLi"> <a href="home.jsx"> Home</a></li>
                <li class="navLi"> <a href="Explore.jsx"> Explore</a></li>
                <li class="navLi"> <a href="#"> About us</a></li>
                <li class="navLi"> <a href="#bottom"> Our Team</a></li>
            </ul>
            <div>
                <button class="btn py-1 px-5 rounded-lg border-solid border-2 mr-10 border-gray-700 hover:border-green-500 hover:text-green-500">Sign up</button>
                <button class="btn hover:bg-green-600 py-1.5 rounded-lg px-5 bg-green-500 text-white">Log in</button>
            </div>
        </div>
    )
}

export default Navbar;