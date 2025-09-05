import { Link } from 'react-router-dom';
import { BsInstagram, BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <footer className="bg-[#1C1C1C] text-gray-300 border-t border-purple-900 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-2xl font-gothic tracking-wider text-purple-500 hover:text-red-500 transition"
            >
              Veloci's <span className="text-gray-100">Hideout</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              A gothic corner for coders, readers, artists & gamers.  
              Stay inspired, stay different.
            </p>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-red-500 transition">
                  Our Story
                </Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/bookish__strokes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition"
                >
                  Art Handle
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/KillerHyena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/aaryanverma2007/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Veloci's Hideout. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="https://www.linkedin.com/in/aaryanverma2007/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition transform hover:scale-110"
            >
              <BsLinkedin size={20} />
            </a>
            <a
              href="https://www.instagram.com/bookish__strokes/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition transform hover:scale-110"
            >
              <BsInstagram size={20} />
            </a>
            <a
              href="https://github.com/KillerHyena"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition transform hover:scale-110"
            >
              <BsGithub size={20} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition transform hover:scale-110"
            >
              <BsTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
