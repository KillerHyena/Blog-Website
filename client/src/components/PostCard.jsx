import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border-2 border-purple-700 hover:border-red-700 h-[400px] overflow-hidden rounded-xl sm:w-[430px] transition-all mx-auto bg-[#1C1C1C] shadow-lg hover:shadow-red-900/30'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full object-cover group-hover:brightness-110 transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-4 flex flex-col gap-3'>
        <p className='text-lg font-gothic font-semibold text-purple-400 line-clamp-2'>{post.title}</p>
        <span className='italic text-sm text-gray-400'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='mt-2 px-4 py-2 bg-purple-700 hover:bg-red-700 text-white text-center rounded-full transition-all duration-300 font-semibold transform hover:scale-105'
        >
          Read Article
        </Link>
      </div>
    </div>
  );
}