import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

interface HeaderProps {
  showDonateButton: boolean;
}

const Header = ({ showDonateButton }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-[#0A0910] via-[#2A2240] to-[#181C30] text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/logo.svg"
              className="h-10"
              alt="Allsmart Allstar"
            />
          </Link>
          <nav className="md:block hidden">
            <ul className="flex space-x-6">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-500" : "hover:text-gray-300"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/shows"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-500" : "hover:text-gray-300"
                  }
                >
                  Shows
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/schedule"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-500" : "hover:text-gray-300"
                  }
                >
                  Schedule
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-500" : "hover:text-gray-300"
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-500" : "hover:text-gray-300"
                  }
                >
                  Contact
                </NavLink>
              </li>
              {showDonateButton && (
                <li>
                  <NavLink
                    to="/donate?utm_source=siteemci&utm_medium=bouton_topmenu"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                    }
                  >
                    Donate
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/sign-in"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      : "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  }
                >
                  Sign In
                </NavLink>
              </li>
            </ul>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden block focus:outline-none"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0910] text-white">
              <ul className="flex flex-col space-y-6 items-center mt-6">
                <li>
                  <SheetClose asChild>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive ? "text-yellow-500" : "hover:text-gray-300 "
                      }
                    >
                      Home
                    </NavLink>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <NavLink
                      to="/shows"
                      className={({ isActive }) =>
                        isActive ? "text-yellow-500" : "hover:text-gray-300"
                      }
                    >
                      Shows
                    </NavLink>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <NavLink
                      to="/schedule"
                      className={({ isActive }) =>
                        isActive ? "text-yellow-500" : "hover:text-gray-300"
                      }
                    >
                      Schedule
                    </NavLink>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive ? "text-yellow-500" : "hover:text-gray-300"
                      }
                    >
                      About
                    </NavLink>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        isActive ? "text-yellow-500" : "hover:text-gray-300"
                      }
                    >
                      Contact
                    </NavLink>
                  </SheetClose>
                </li>
                {showDonateButton && (
                  <li>
                    <SheetClose asChild>
                      <NavLink
                        to="/donate?utm_source=siteemci&utm_medium=bouton_topmenu"
                        className={
                          "bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                        }
                      >
                        Donate
                      </NavLink>
                    </SheetClose>
                  </li>
                )}
                <li>
                  <SheetClose asChild>
                    <NavLink
                      to="/sign-in"
                      className={
                        "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      }
                    >
                      Sign In
                    </NavLink>
                  </SheetClose>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
