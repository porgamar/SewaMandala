// import React from "react";
import Navbar from "./pages/navbar";
import Footer from "./pages/footer";
import IndexPage from "./pages/home";
import UserProfile from "./pages/profile";
import ExplorePage from "./pages/Explore";
import Client from "./pages/client_listing"
import Talent from "./pages/talent_listing"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/Explore" element={<ExplorePage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        <Routes>
          <Route path="/client" element={<Client/>}/>
          <Route path="/Talent" element={<Talent/>}/>
        </Routes>
      </Router>
      <Footer />
    </>
  )
}
export default App;