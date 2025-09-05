import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#1C1C1C] min-h-screen text-gray-200">
      {/* Hero Section */}
      <div className="flex flex-col gap-8 p-10 px-3 max-w-6xl mx-auto">
        <h1 className="text-4xl font-gothic lg:text-7xl pt-10 text-purple-500 tracking-wider text-center">
          Step into Veloci's Hideout
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed text-center max-w-3xl mx-auto">
          A space where code meets creativity, where poetry lives beside pixels,
          and where books, art, and games all have their place.
          <br />This isn't just a blog — it's a collection of thoughts, stories,
          and ideas from a wandering mind that loves to build, imagine, and play.
        </p>
        <div className="flex justify-center">
          <Link
            to="/search"
            className="px-6 py-3 bg-purple-700 hover:bg-red-700 transition rounded-full text-white font-semibold shadow-lg"
          >
            Explore All Posts
          </Link>
        </div>
        <div className="p-6 bg-[#111] border border-purple-900 rounded-xl mt-6">
          <CallToAction />
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-10 py-8">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-gothic text-purple-500 text-center tracking-wide">
              Latest Writings & Musings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link
                to="/search"
                className="flex items-center gap-2 text-purple-400 hover:text-red-500 transition font-semibold"
              >
                Browse the archive
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}