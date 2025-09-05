import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
            Join our eerie sanctuary of creators, dreamers, and outsiders.  
            Create your account and embrace the gothic vibes.
          </p>
        </div>

        {/* Right Form */}
        <div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-purple-500" />
              <input
                type="text"
                id="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-lg bg-[#2A2A2A] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-purple-500" />
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* OAuth */}
            <OAuth />
          </form>

          {/* Switch to Sign In */}
          <div className="flex gap-2 text-sm mt-6 justify-center">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="text-purple-400 hover:text-red-500 transition">
              Sign In
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
