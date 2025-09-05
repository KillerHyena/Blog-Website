import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
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

  // Custom sidebar item component
  const SidebarItem = ({ icon: Icon, label, active, isAdmin, to, onClick, isSignOut = false }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-purple-700 text-white shadow-lg'
          : 'text-gray-300 hover:bg-purple-900 hover:text-white'
      } ${isSignOut ? 'mt-auto border-t border-purple-900' : ''}`}
    >
      <Icon className="h-5 w-5" />
      <span className="ml-3">{label}</span>
      {isAdmin && (
        <span className="ml-auto px-2 py-1 text-xs bg-purple-900 rounded-full">
          Admin
        </span>
      )}
    </Link>
  );

  return (
    <div className="w-full md:w-64 bg-[#111] h-full flex flex-col p-4 border-r border-purple-900">
      <div className="mb-6">
        <h2 className="text-xl font-gothic text-purple-500">Dashboard</h2>
        <p className="text-sm text-gray-400">Welcome, {currentUser.username}</p>
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        {currentUser && currentUser.isAdmin && (
          <SidebarItem
            icon={HiChartPie}
            label="Dashboard"
            active={tab === 'dash' || !tab}
            to="/dashboard?tab=dash"
          />
        )}
        
        <SidebarItem
          icon={HiUser}
          label="Profile"
          active={tab === 'profile'}
          isAdmin={currentUser.isAdmin}
          to="/dashboard?tab=profile"
        />
        
        {currentUser.isAdmin && (
          <>
            <SidebarItem
              icon={HiDocumentText}
              label="Posts"
              active={tab === 'posts'}
              to="/dashboard?tab=posts"
            />
            
            <SidebarItem
              icon={HiOutlineUserGroup}
              label="Users"
              active={tab === 'users'}
              to="/dashboard?tab=users"
            />
            
            <SidebarItem
              icon={HiAnnotation}
              label="Comments"
              active={tab === 'comments'}
              to="/dashboard?tab=comments"
            />
          </>
        )}
        
        {/* Sign Out button at the bottom */}
        <div className="mt-auto pt-4 border-t border-purple-900">
          <button
            onClick={handleSignout}
            className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-red-900 hover:text-white transition-all duration-200"
          >
            <HiArrowSmRight className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}