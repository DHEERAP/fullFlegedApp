// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import appwriteService from "../appwrite/config";
// import {Button, Container} from "../components";
// import parse from "html-react-parser";
// import { useSelector } from "react-redux";

// export default function Post() {

//     const [post, setPost] = useState(null);
//     const {slug} = useParams(); 
//     const navigate = useNavigate();

//     const userData = useSelector((state) => state.auth.userData); 
//     const isAuthor = post && userData ? post.userId === userData.$id : false;


//     useEffect(() => {   
//      if(slug) {
//         appwriteService.getPost(slug).then((post) => {
//             if(post) {
//                 setPost(post);
//             }
//             else navigate("/");
//         });
//      }    
    
//    else {
//     navigate("/");
//    }
//     }, [navigate, slug]);


//     const deletePost = () => {
//             appwriteService.deletePost(post.$id).then((status) => {
//                 if(status) {
//                     appwriteService.deleteFile(post.featuredImage);
//                     navigate("/");
//                 }
//             });
//     };

//     return post ? (
//         <div className="py-8">
//             <Container>
//                 <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
//                     <img
//                         src={appwriteService.getFilePreview(post.featuredImage)}
//                         alt={post.title}
//                         className="rounded-xl"
//                     />
//                     {isAuthor && (
//                         <div className="absolute right-6 top-6">
//                             <Link to={`/edit-post/${post.$id}`}>
//                                 <Button bgColor="bg-green-500" className="mr-3">
//                                     Edit
//                                 </Button>
//                             </Link>
//                             <Button bgColor="bg-red-500" onClick={deletePost}>
//                                 Delete
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//                 <div className="w-full mb-6">
//                     <h1 className="text-2xl font-bold">{post.title}</h1>
//                 </div>
//                 <div className="browser-css">
//                     {parse(post.content)}
//                     </div>
//             </Container>
//         </div>
//     ) : null;
// }












// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import appwriteService from "../appwrite/config";
// import { Button, Container } from "../components";
// import parse from "html-react-parser";
// import { useSelector } from "react-redux";
// import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

// export default function Post() {
//   const [post, setPost] = useState(null);
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.auth.userData);
//   const isAuthor = post && userData ? post.userId === userData.$id : false;

//   useEffect(() => {
//     if (slug) {
//       appwriteService.getPost(slug).then((post) => {
//         if (post) {
//           setPost(post);
//         } else navigate("/");
//       });
//     } else {
//       navigate("/");
//     }
//   }, [navigate, slug]);

//   const deletePost = () => {
//     appwriteService.deletePost(post.$id).then((status) => {
//       if (status) {
//         appwriteService.deleteFile(post.featuredImage);
//         navigate("/");
//       }
//     });
//   };

//   const download = () => {
//     const fileId = post.featuredImage;
//     const title = post.title;
//     const content = post.content;
//     const imageUrl = appwriteService.getFilePreview(post.featuredImage);
//     appwriteService.downloadFile(fileId, title, content, imageUrl);
//   };

//   return post ? (
//     <div className="py-20 bg-gradient-to-b from-gray-50 to-blue-100">
//       <Container>
//         {/* Image Section */}
//         <div className="w-full flex justify-center mb-6 relative border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
//           <img
//             src={appwriteService.getFilePreview(post.featuredImage)}
//             alt={post.title}
//             className="w-full h-96 object-cover rounded-xl"
//           />
//           {isAuthor && (
//             <div className="absolute top-4 right-4 flex space-x-3">
//               <Link to={`/edit-post/${post.$id}`}>
//                 <Button
//                   bgColor="bg-green-500"
//                   className="hover:bg-green-600 transition-all duration-300"
//                 >
//                   Edit
//                 </Button>
//               </Link>
//               <Button
//                 bgColor="bg-red-500"
//                 onClick={deletePost}
//                 className="hover:bg-red-600 transition-all duration-300"
//               >
//                 Delete
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Title Section with Hover Effect */}
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold text-gray-800 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg py-4 px-6 rounded-lg inline-block">
//             {post.title}
//           </h1>
//         </div>

//         {/* Content Section with Gradient Background */}
//         <div className="w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-200 p-8 rounded-lg shadow-lg mb-8">
//           <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
//             {parse(post.content)}
//           </div>
//         </div>

//         {/* Download Button */}
//         <div className="w-full text-center mt-8">
//           <Button
//             bgColor="bg-blue-500"
//             onClick={download}
//             className="hover:bg-blue-600 transition-all duration-300 px-8 py-4 rounded-full text-white text-lg"
//           >
//             Download Post
//           </Button>
//         </div>

//         {/* Share Section */}
//         <div className="w-full text-center mt-8">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Share this post</h3>
//           <div className="flex justify-center space-x-8">
//             <button
//               onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
//               className="text-blue-600 hover:text-blue-700 transition-all duration-300 text-4xl p-3 rounded-full bg-blue-100 hover:bg-blue-200"
//             >
//               <FaFacebook />
//             </button>

//             <button
//               onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")}
//               className="text-blue-400 hover:text-blue-500 transition-all duration-300 text-4xl p-3 rounded-full bg-blue-100 hover:bg-blue-200"
//             >
//               <FaTwitter />
//             </button>

//             <button
//               onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
//               className="text-pink-500 hover:text-pink-600 transition-all duration-300 text-4xl p-3 rounded-full bg-pink-100 hover:bg-pink-200"
//             >
//               <FaInstagram />
//             </button>

//             <button
//               onClick={() => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank")}
//               className="text-green-500 hover:text-green-600 transition-all duration-300 text-4xl p-3 rounded-full bg-green-100 hover:bg-green-200"
//             >
//               <FaWhatsapp />
//             </button>
//           </div>
//         </div>
//       </Container>
//     </div>
//   ) : null;
// }







// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import appwriteService from "../appwrite/config";
// import { Button, Container } from "../components";
// import parse from "html-react-parser";
// import { useSelector } from "react-redux";
// import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

// export default function Post() {
//   const [post, setPost] = useState(null);
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.auth.userData);
//   const isAuthor = post && userData ? post.userId === userData.$id : false;

//   useEffect(() => {
//     if (slug) {
//       appwriteService.getPost(slug).then((post) => {
//         if (post) {
//           setPost(post);
//         } else navigate("/");
//       });
//     } else {
//       navigate("/");
//     }
//   }, [navigate, slug]);

//   const deletePost = () => {
//     appwriteService.deletePost(post.$id).then((status) => {
//       if (status) {
//         appwriteService.deleteFile(post.featuredImage);
//         navigate("/");
//       }
//     });
//   };

//   const download = () => {
//     const fileId = post.featuredImage;
//     const title = post.title;
//     const content = post.content;
//     const imageUrl = appwriteService.getFilePreview(post.featuredImage);
//     appwriteService.downloadFile(fileId, title, content, imageUrl);
//   };

//   return post ? (
//     <div className="py-20 bg-gradient-to-b from-gray-50 to-blue-100">
//       <Container>
//         {/* Author Actions (Edit and Delete) */}
//         {isAuthor && (
//           <div className="relative">
//             {/* Image Section */}
//             <div className="w-full flex justify-center mb-6 relative border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
//               <img
//                 src={appwriteService.getFilePreview(post.featuredImage)}
//                 alt={post.title}
//                 className="w-full h-96 object-cover rounded-xl"
//               />

//               {/* Edit and Delete Buttons */}
//               <div className="absolute bottom-4 left-4">
//                 <Link to={`/edit-post/${post.$id}`}>
//                   <Button
//                     bgColor="bg-green-500"
//                     className="hover:bg-green-600 transition-all duration-300 px-6 py-3 rounded-full text-white text-lg shadow-lg"
//                   >
//                     Edit
//                   </Button>
//                 </Link>
//               </div>

//               <div className="absolute bottom-4 right-4">
//                 <Button
//                   bgColor="bg-red-500"
//                   onClick={deletePost}
//                   className="hover:bg-red-600 transition-all duration-300 px-6 py-3 rounded-full text-white text-lg shadow-lg"
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Title Section with Hover Effect */}
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold text-gray-800 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg py-4 px-6 rounded-lg inline-block">
//             {post.title}
//           </h1>
//         </div>

//         {/* Content Section with Gradient Background */}
//         <div className="w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-200 p-8 rounded-lg shadow-lg mb-8">
//           <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
//             {parse(post.content)}
//           </div>
//         </div>

//         {/* Download Button */}
//         <div className="w-full text-center mt-8">
//           <Button
//             bgColor="bg-blue-500"
//             onClick={download}
//             className="hover:bg-blue-600 transition-all duration-300 px-8 py-4 rounded-full text-white text-lg"
//           >
//             Download Post
//           </Button>
//         </div>

//         {/* Share Section */}
//         <div className="w-full text-center mt-8">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Share this post</h3>
//           <div className="flex justify-center space-x-8">
//             <button
//               onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
//               className="text-blue-600 hover:text-blue-700 transition-all duration-300 text-4xl p-4 rounded-full bg-blue-100 hover:bg-blue-200"
//             >
//               <FaFacebook />
//             </button>

//             <button
//               onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")}
//               className="text-blue-400 hover:text-blue-500 transition-all duration-300 text-4xl p-4 rounded-full bg-blue-100 hover:bg-blue-200"
//             >
//               <FaTwitter />
//             </button>

//             <button
//               onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
//               className="text-pink-500 hover:text-pink-600 transition-all duration-300 text-4xl p-4 rounded-full bg-pink-100 hover:bg-pink-200"
//             >
//               <FaInstagram />
//             </button>

//             <button
//               onClick={() => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank")}
//               className="text-green-500 hover:text-green-600 transition-all duration-300 text-4xl p-4 rounded-full bg-green-100 hover:bg-green-200"
//             >
//               <FaWhatsapp />
//             </button>
//           </div>
//         </div>
//       </Container>
//     </div>
//   ) : null;
// }









import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
        } else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [navigate, slug]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  const download = () => {
    const fileId = post.featuredImage;
    const title = post.title;
    const content = post.content;
    const imageUrl = appwriteService.getFilePreview(post.featuredImage);
    appwriteService.downloadFile(fileId, title, content, imageUrl);
  };

  return post ? (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-blue-100">
      <Container>
        {/* Author Actions (Edit and Delete) */}
        {isAuthor && (
          <div className="relative">
            {/* Image Section */}
            <div className="w-full flex justify-center mb-6 relative border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-full h-96 object-cover rounded-xl"
              />

              {/* Edit and Delete Buttons */}
              <div className="absolute bottom-4 left-4">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button
                    bgColor="bg-green-500"
                    className="hover:bg-green-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg"
                  >
                    Edit
                  </Button>
                </Link>
              </div>

              <div className="absolute top-4 right-4">
                <Button
                  bgColor="bg-red-500"
                  onClick={deletePost}
                  className="hover:bg-red-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Title Section with Hover Effect */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg py-4 px-6 rounded-lg inline-block">
            {post.title}
          </h1>
        </div>

        {/* Content Section with Gradient Background */}
        <div className="w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-200 p-8 rounded-lg shadow-lg mb-8">
          <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
            {parse(post.content)}
          </div>
        </div>

        {/* Download Button */}
        <div className="w-full text-center mt-8">
          <Button
            bgColor="bg-blue-500"
            onClick={download}
            className="hover:bg-blue-600 transition-all duration-300 px-8 py-4 rounded-full text-white text-lg"
          >
            Download Post
          </Button>
        </div>

        {/* Share Section */}
        <div className="w-full text-center mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Share this post</h3>
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
              className="text-blue-600 hover:text-blue-700 transition-all duration-300 text-4xl p-4 rounded-full bg-blue-100 hover:bg-blue-200"
            >
              <FaFacebook />
            </button>

            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")}
              className="text-blue-400 hover:text-blue-500 transition-all duration-300 text-4xl p-4 rounded-full bg-blue-100 hover:bg-blue-200"
            >
              <FaTwitter />
            </button>

            <button
              onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
              className="text-pink-500 hover:text-pink-600 transition-all duration-300 text-4xl p-4 rounded-full bg-pink-100 hover:bg-pink-200"
            >
              <FaInstagram />
            </button>

            <button
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank")}
              className="text-green-500 hover:text-green-600 transition-all duration-300 text-4xl p-4 rounded-full bg-green-100 hover:bg-green-200"
            >
              <FaWhatsapp />
            </button>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
