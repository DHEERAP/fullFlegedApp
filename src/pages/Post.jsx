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









import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

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

  return post ? (
    <div className="py-40 bg-gray-50">
      <Container>
        {/* Image Section */}
        <div className="w-full flex justify-center mb-4 relative border rounded-xl shadow-lg overflow-hidden">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full h-auto object-cover rounded-xl"
          />
          {isAuthor && (
            <div className="absolute right-6 top-6 flex space-x-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button
                  bgColor="bg-green-500"
                  className="hover:bg-green-600 transition-all duration-300"
                >
                  Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500"
                onClick={deletePost}
                className="hover:bg-red-600 transition-all duration-300"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title Section with Hover Effect */}
        <div className="w-full mb-4 text-center sticky top-0 z-10 bg-white py-4">
          <h1 className="text-3xl font-bold text-gray-800 hover:text-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg p-4 rounded-lg inline-block">
            {post.title}
          </h1>
        </div>

        {/* Content Section with Gradient Background */}
        <div className="w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-200 p-6 rounded-lg shadow-md mb-6">
          <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
            {parse(post.content)}
          </div>
        </div>

        {/* Post Sharing Section */}
        <div className="w-full text-center mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Share this post</h3>
          <div className="space-x-4">
            <Link
              to={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              className="text-blue-600 hover:text-blue-700 transition-all duration-300"
            >
              Facebook
            </Link>
            <Link
              to={`https://twitter.com/intent/tweet?url=${window.location.href}`}
              target="_blank"
              className="text-blue-400 hover:text-blue-500 transition-all duration-300"
            >
              Twitter
            </Link>
            {/* Add more social media links as necessary */}
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
