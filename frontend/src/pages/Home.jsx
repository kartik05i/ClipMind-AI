import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Timeline from "../components/Timeline";
import LoginCard from "../components/LoginCard";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="max-w-7xl mx-auto pt-36 px-8 flex justify-between items-start">

        {/* Left Side */}
        <div className="w-1/2">
          <Hero />
          <Timeline />
        </div>

        {/* Right Side */}
        <div className="w-[420px]">
          <LoginCard />
        </div>

      </div>
    </div>
  );
}

export default Home;