


// import React from 'react'

// import { Link } from "react-router-dom";

// import appwriteService from "../appwrite/config"



 
//   function PostCard({$id,  title, featuredImage}) {
    
// return (
//                   <Link to={`/post/${$id}`}>
//            <div className='w-full bg-gray-100 rounded-xl p-4'>
//               <div className='w-full justify-center mb-4'>
//                 <img src={appwriteService.getFilePreview(featuredImage)} alt={title}
//                   className='rounded-xl' />

//               </div>
//               <h2
//               className='text-xl font-bold'
//               >{title}</h2>
//              </div>
//   </Link>
// )
// }
// export default PostCard





import React from 'react';
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        {/* Image with hover effect */}
        <div className="w-full mb-4">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl w-full h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;