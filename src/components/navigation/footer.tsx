import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p>
              Reality TV is your go-to destination for the most exciting and
              dramatic reality shows. Stay tuned for non-stop entertainment!
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shows" className="hover:text-gray-300">
                  Our Shows
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-gray-300">
                  TV Schedule
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-5">
              <Link to="#" className="text-blue-500 hover:text-blue-400">
                <Facebook size={30} />
              </Link>
              <Link to="#" className="text-red-500 hover:text-red-400">
                <Youtube size={30} />
              </Link>
              <Link to="#" className="text-pink-500 hover:text-pink-400">
                <Instagram size={30} />
              </Link>
              <Link to="#" className="text-blue-400 hover:text-blue-300">
                <Twitter size={30} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} AllSmartAllStar TV. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
