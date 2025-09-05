import { Avatar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1C1C1C] text-white shadow-lg border-b border-purple-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link to="/" className="text-2xl font-gothic tracking-wider hover:text-purple-400 transition">
          Veloci's <span className="text-purple-600">Hideout</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSubmit} className="hidden md:flex items-center bg-[#2A2A2A] rounded-full px-3 py-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
          />
          <button type="submit" className="text-purple-500 hover:text-red-500 transition">
            <AiOutlineSearch size={20} />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-full bg-[#2A2A2A] hover:bg-purple-800 transition"
          >
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </button>

          {/* User / Auth */}
          {currentUser ? (
            <div className="relative group">
              <Avatar alt="user" img={currentUser.profilePicture} rounded className="cursor-pointer ring-2 ring-purple-600" />
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-[#2A2A2A] text-sm rounded-lg shadow-lg w-40">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="truncate">@{currentUser.username}</p>
                  <p className="truncate text-gray-400">{currentUser.email}</p>
                </div>
                <Link to="/dashboard?tab=profile" className="block px-4 py-2 hover:bg-purple-700">
                  Profile
                </Link>
                <button
                  onClick={handleSignout}
                  className="w-full text-left px-4 py-2 hover:bg-red-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/sign-in">
              <button className="px-4 py-2 bg-purple-700 hover:bg-red-700 transition rounded-full text-sm">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex justify-center gap-8 py-2 bg-[#111] text-sm uppercase tracking-wide border-t border-purple-900">
        <Link
          to="/"
          className={`hover:text-purple-400 relative ${path === '/' ? 'text-purple-500' : ''}`}
        >
          Home
          {path === '/' && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-purple-600"></span>}
        </Link>
        <Link
          to="/about"
          className={`hover:text-purple-400 relative ${path === '/about' ? 'text-purple-500' : ''}`}
        >
          About
          {path === '/about' && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-purple-600"></span>}
        </Link>
        <Link
          to="/projects"
          className={`hover:text-purple-400 relative ${path === '/projects' ? 'text-purple-500' : ''}`}
        >
          Blogs
          {path === '/projects' && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-purple-600"></span>}
        </Link>
      </nav>
    </header>
  );
}
