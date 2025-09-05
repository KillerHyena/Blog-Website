import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-4xl mx-auto w-full p-6 bg-[#1C1C1C] rounded-xl border border-purple-900'>
      {currentUser ? (
        <div className='flex items-center gap-2 my-5 text-gray-400 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-6 w-6 object-cover rounded-full border border-purple-700'
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-purple-400 hover:text-red-500 transition'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-gray-400 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-purple-400 hover:text-red-500 transition' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-purple-700 rounded-lg p-4 bg-[#2A2A2A]'
        >
          <textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className='w-full p-3 bg-[#1C1C1C] text-gray-200 border border-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600'
          />
          <div className='flex justify-between items-center mt-4'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <button 
              type='submit'
              className='px-4 py-2 bg-purple-700 hover:bg-red-700 text-white rounded-full transition font-semibold'
            >
              Submit
            </button>
          </div>
          {commentError && (
            <div className='mt-4 p-2 bg-red-900 text-red-200 rounded-lg text-sm'>
              {commentError}
            </div>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5 text-gray-400'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-2'>
            <p className='text-gray-400'>Comments</p>
            <div className='border border-purple-700 py-1 px-2 rounded-full bg-purple-900'>
              <p className='text-purple-300'>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
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
                  onClick={() => handleDelete(commentToDelete)}
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