import React from "react";
import Navbar from "./pages/navbar";
import Footer from "./pages/footer";

import IndexPage from "./pages/home";
import Profile from "./pages/Profile";
import ExplorePage from "./pages/Explore";
import Services from "./pages/Services";
import OurTeam from "./pages/OurTeam";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/Home" element={<IndexPage />} />
          <Route path="/Explore" element={<ExplorePage />} />
          <Route path="/OurTeam" element={<OurTeam />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}
export default App;