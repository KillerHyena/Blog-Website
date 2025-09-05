import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen bg-[#1C1C1C] text-gray-200 flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className='md:w-64 bg-[#111] border-r border-purple-900'>
        <DashSidebar />
      </div>
      
      {/* Main Content */}
      <div className='flex-1 p-6'>
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
        {tab === 'users' && <DashUsers />}
        {tab === 'comments' && <DashComments />}
        {tab === 'dash' && <DashboardComp />}
        
        {/* Default view when no tab is selected */}
        {!tab && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-gothic text-purple-500 mb-4">Welcome to the Dashboard</h2>
              <p className="text-gray-400">Select a section from the sidebar to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}