function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center">

        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
            ClipMind AI
          </h1>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-10 ml-20 text-gray-800 font-medium">
          <li className="cursor-pointer hover:text-blue-600 transition duration-300">
            Features
          </li>

          <li className="cursor-pointer hover:text-blue-600 transition duration-300">
            How It Works
          </li>

          <li className="cursor-pointer hover:text-blue-600 transition duration-300">
            About Us
          </li>

          <li className="cursor-pointer hover:text-blue-600 transition duration-300">
            Contact Us
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;