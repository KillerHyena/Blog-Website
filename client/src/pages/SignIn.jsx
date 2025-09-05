import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FaUser, FaLock } from 'react-icons/fa';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C1C1C] text-gray-200 px-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 bg-[#111] p-10 rounded-xl shadow-2xl border border-purple-900">
        
        {/* Left Branding */}
        <div className="flex flex-col justify-center">
          <Link to="/" className="text-4xl font-gothic tracking-wider text-purple-500 hover:text-red-500 transition">
            Veloci's <span className="text-gray-100">Hideout</span>
          </Link>
          <p className="mt-6 text-sm text-gray-400 leading-relaxed">
            Step into the gothic realm of coders, readers, artists & dreamers.  
            Sign in to continue your journey.
          </p>
        </div>

        {/* Right Form */}
        <div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-purple-500" />
              <input
                type="email"
                id="email"
                placeholder="Email address"
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-lg bg-[#2A2A2A] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            
            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-purple-500" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-lg bg-[#2A2A2A] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-700 hover:bg-red-700 transition text-white font-semibold shadow-lg disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            {/* OAuth */}
            <OAuth />
          </form>

          {/* Sign Up Link */}
          <div className="flex gap-2 text-sm mt-6 justify-center">
            <span>Don’t have an account?</span>
            <Link to="/sign-up" className="text-purple-400 hover:text-red-500 transition">
              Sign Up
            </Link>
          </div>

          {/* Error */}
          {errorMessage && (
            <p className="mt-4 text-center text-red-500 font-medium">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
