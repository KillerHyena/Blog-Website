import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen bg-[#1C1C1C]'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen bg-[#1C1C1C] text-red-500'>
        <h1 className='text-2xl'>Something went wrong!</h1>
      </div>
    );

  return (
    <main className='bg-[#1C1C1C] text-gray-200 min-h-screen'>
      <div className='p-6 max-w-6xl mx-auto'>
        <h1 className='text-4xl mt-10 text-center font-gothic max-w-4xl mx-auto lg:text-5xl text-purple-500 tracking-wide'>
          {post && post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className='flex justify-center mt-6'
        >
          <span className='px-4 py-2 bg-purple-700 hover:bg-red-700 transition rounded-full text-sm font-semibold'>
            {post && post.category}
          </span>
        </Link>
        
        {post && post.image && (
          <img
            src={post.image}
            alt={post.title}
            className='mt-10 rounded-xl shadow-lg border border-purple-900 max-h-[600px] w-full object-cover'
          />
        )}
        
        <div className='flex justify-between p-4 border-b border-purple-900 mx-auto w-full max-w-4xl text-sm mt-8'>
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className='italic text-gray-400'>
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        
        <div
          className='p-4 max-w-4xl mx-auto w-full post-content text-lg leading-relaxed'
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        
        <div className='max-w-4xl mx-auto w-full mt-10'>
          <CallToAction />
        </div>
        
        <div className='max-w-4xl mx-auto w-full mt-12'>
          <CommentSection postId={post._id} />
        </div>

        <div className='flex flex-col justify-center items-center my-12'>
          <h1 className='text-2xl mt-5 font-gothic text-purple-500'>Recent Articles</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-6xl'>
            {recentPosts &&
              recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        </div>
      </div>
    </main>
  );
}