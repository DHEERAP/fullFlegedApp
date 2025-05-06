import React from 'react';
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, status, userId, currentUserId, showTags = true }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="relative">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
        </div>
        {showTags && (
          <>
            {/* Status Tag - Top Right */}
            <div className={`absolute top-2 right-2 py-1 px-3 text-white font-semibold rounded-full ${
              status === 'active' ? 'bg-green-500' : 'bg-red-400'
            }`}>
              {status === 'active' ? 'Active' : 'Not Active'}
            </div>

            {/* "Your Post" Tag - Bottom Left */}
            {currentUserId === userId && (
              <div className="absolute bottom-2 left-2 py-1 px-3 text-white bg-blue-500 font-semibold rounded-full">
                Your Post
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;