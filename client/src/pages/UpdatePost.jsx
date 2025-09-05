import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaUpload } from 'react-icons/fa';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setFormData(data.posts[0]);
      } catch (error) {
        setPublishError(error.message);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen text-gray-200">
      <h1 className="text-center text-4xl gothic-font my-8 text-purple-500 tracking-widest">
        Update Your Tale 🖋️
      </h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Title + Category */}
        <div className="flex flex-col gap-6 sm:flex-row">
          <input
            type="text"
            placeholder="Post Title"
            required
            value={formData.title || ''}
            className="flex-1 bg-transparent border-b-2 border-gray-600 focus:border-purple-600 outline-none p-2 text-lg"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <select
            value={formData.category || 'uncategorized'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="bg-transparent border-b-2 border-gray-600 focus:border-purple-600 outline-none p-2 text-lg"
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex items-center justify-between p-4 border-2 border-dashed border-purple-600 rounded-lg bg-[#111]">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-400"
          />
          <button
            type="button"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-red-700 transition rounded-lg text-white font-semibold shadow-md disabled:opacity-70"
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                  styles={{
                    path: { stroke: '#9333ea' },
                    text: { fill: '#9333ea' },
                  }}
                />
              </div>
            ) : (
              <>
                <FaUpload /> Upload Image
              </>
            )}
          </button>
        </div>

        {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover rounded-lg shadow-lg border border-gray-700"
          />
        )}

        {/* Content */}
        <ReactQuill
          theme="snow"
          value={formData.content || ''}
          placeholder="Write your eerie tale..."
          className="h-72 mb-16 dark-theme-quill"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        {/* Update Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-purple-700 hover:bg-red-700 transition text-white font-semibold shadow-xl"
        >
          Update Story
        </button>

        {publishError && (
          <p className="mt-4 text-center text-red-500 font-medium">{publishError}</p>
        )}
      </form>
    </div>
  );
}
