import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-6 bg-[#1C1C1C] text-gray-200 rounded-lg border border-purple-900'>
      <h2 className='text-2xl font-gothic text-purple-500 mb-6'>Comments Management</h2>
      
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-400'>
              <thead className='text-xs uppercase bg-[#111] text-purple-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>Date Updated</th>
                  <th scope='col' className='px-6 py-3'>Comment Content</th>
                  <th scope='col' className='px-6 py-3'>Likes</th>
                  <th scope='col' className='px-6 py-3'>Post ID</th>
                  <th scope='col' className='px-6 py-3'>User ID</th>
                  <th scope='col' className='px-6 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className='border-b border-purple-900 bg-[#2A2A2A] hover:bg-[#333]'>
                    <td className='px-6 py-4'>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 max-w-xs truncate' title={comment.content}>
                      {comment.content}
                    </td>
                    <td className='px-6 py-4'>{comment.numberOfLikes}</td>
                    <td className='px-6 py-4 font-mono text-xs'>{comment.postId}</td>
                    <td className='px-6 py-4 font-mono text-xs'>{comment.userId}</td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
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
        <p className='text-gray-400'>No comments found</p>
      )}
      
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] p-6 rounded-xl border border-purple-700 max-w-md w-full mx-4">
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-purple-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-300">
                Are you sure you want to delete this comment?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-full transition"
                  onClick={handleDeleteComment}
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