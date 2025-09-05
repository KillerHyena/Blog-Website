import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-6 bg-[#1C1C1C] text-gray-200 rounded-lg border border-purple-900'>
      <h2 className='text-2xl font-gothic text-purple-500 mb-6'>Your Posts</h2>
      
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-400'>
              <thead className='text-xs uppercase bg-[#111] text-purple-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>Date Updated</th>
                  <th scope='col' className='px-6 py-3'>Post Image</th>
                  <th scope='col' className='px-6 py-3'>Post Title</th>
                  <th scope='col' className='px-6 py-3'>Category</th>
                  <th scope='col' className='px-6 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userPosts.map((post) => (
                  <tr key={post._id} className='border-b border-purple-900 bg-[#2A2A2A] hover:bg-[#333]'>
                    <td className='px-6 py-4'>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4'>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className='w-16 h-10 object-cover rounded border border-purple-700'
                        />
                      </Link>
                    </td>
                    <td className='px-6 py-4 font-medium text-white'>
                      <Link to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </td>
                    <td className='px-6 py-4'>{post.category}</td>
                    <td className='px-6 py-4 flex space-x-3'>
                      <Link
                        to={`/update-post/${post._id}`}
                        className='font-medium text-purple-500 hover:text-purple-400 transition'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className='font-medium text-red-500 hover:text-red-400 transition'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full mt-6 py-2 bg-purple-700 hover:bg-red-700 text-white rounded-full transition'
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className='text-gray-400'>You have no posts yet!</p>
      )}
      
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] p-6 rounded-xl border border-purple-700 max-w-md w-full mx-4">
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-purple-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-300">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-full transition"
                  onClick={handleDeletePost}
                >
                  Yes, I'm sure
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition"
                  onClick={() => setShowModal(false)}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}