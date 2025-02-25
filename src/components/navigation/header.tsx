import { Tv } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  showDonateButton: boolean;
}

const Header = ({ showDonateButton }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Tv size={32} />
            <span className="text-2xl font-bold">Reality TV</span>
          </Link>
          <nav className="md:block hidden">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shows" className="hover:text-gray-300">
                  Shows
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-gray-300">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </li>
              {showDonateButton && (
                <li>
                  <Link
                    to="/donate?utm_source=siteemci&utm_medium=bouton_topmenu"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                  >
                    Donate
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/sign-in"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
