import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p>
              Allsmart Allstar TV is your go-to destination for the most
              exciting and dramatic reality shows. Stay tuned for non-stop
              entertainment!
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
            <h3 className="text-xl font-semibold mb-4">Shows</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shows" className="hover:text-gray-300">
                  All Shows
                </Link>
              </li>
              <li>
                <Link
                  to="/shows?category=reality"
                  className="hover:text-gray-300"
                >
                  Reality Shows
                </Link>
              </li>
              <li>
                <Link
                  to="/shows?category=competition"
                  className="hover:text-gray-300"
                >
                  Competition Shows
                </Link>
              </li>
              <li>
                <Link
                  to="/shows?category=lifestyle"
                  className="hover:text-gray-300"
                >
                  Lifestyle Shows
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-gray-300">
                  TV Schedule
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
            <div>
              <p className="my-4">
                Get the latest updates on new shows and episodes.
              </p>
              <div className="flex flex-col gap-2">
                <Input placeholder="Your email" />
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-8 mb-5" />
        <div className="text-center">
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
