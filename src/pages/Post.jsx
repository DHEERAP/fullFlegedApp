import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import aiService from "../appwrite/aiService";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaEdit, FaTrash, FaRobot, FaBrain, FaLightbulb } from 'react-icons/fa';

export default function Post() {
  const [post, setPost] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const generateSummary = async () => {
    if (!post) return;
    
    setLoading(true);
    setError(null);
    setAiSummary(null);
    
    try {
      console.log('Starting summary generation...');
      const bulletPoints = await aiService.generateSummary(post.title, post.content);
      console.log('Received bullet points:', bulletPoints);
      
      if (bulletPoints && bulletPoints.length > 0) {
        setAiSummary(bulletPoints);
      } else {
        throw new Error('No bullet points were generated');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
            {/* Image Section with Rounded Corners */}
            <div className="w-full flex justify-center mb-6 relative">
              <div className="w-full max-w-4xl relative">
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                />

                {/* Edit and Delete Buttons - Diagonally Opposite */}
                <div className="absolute top-4 right-4">
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button
                      bgColor="bg-green-500"
                      className="hover:bg-green-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg flex items-center mb-2"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Button
                    bgColor="bg-red-500"
                    onClick={deletePost}
                    className="hover:bg-red-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Title Section */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(post.$createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author || "Anonymous"}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="w-full bg-white p-8 rounded-2xl shadow-lg mb-8 transform hover:shadow-xl transition-all duration-300">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
              {parse(post.content)}
            </div>
          </div>
        </div>

        {/* Enhanced AI Summary Section */}
        <div className="w-full bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg">
                <FaBrain className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">AI-Powered Summary</h2>
                <p className="text-gray-600">Get key insights from this post</p>
              </div>
            </div>
            <Button
              onClick={generateSummary}
              disabled={loading}
              className={`px-6 py-3 rounded-full text-white text-lg shadow-lg flex items-center transition-all duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FaLightbulb className="mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4 animate-fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {aiSummary && (
            <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaRobot className="text-blue-500 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Key Points</h3>
              </div>
              <ul className="space-y-4">
                {aiSummary.map((point, index) => (
                  <li 
                    key={index} 
                    className="flex items-start group transform transition-all duration-300 hover:translate-x-2"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-2 h-2 rounded-full"></div>
                    </div>
                    <p className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!aiSummary && !loading && !error && (
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FaLightbulb className="text-blue-500 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Generate Summary</h3>
                <p className="text-gray-600">Click the button above to get AI-generated key points from this post.</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Download and Share Section */}
        <div className="w-full mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Download Post</h3>
                <p className="text-gray-600 mb-6">Save this post for offline reading</p>
                <Button
                  bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
                  onClick={download}
                  className="hover:from-blue-600 hover:to-blue-700 transition-all duration-300 px-8 py-4 rounded-full text-white text-lg shadow-lg transform hover:scale-105 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Now
                </Button>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Share This Post</h3>
                <p className="text-gray-600 mb-6">Spread the word with your friends</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaFacebook className="text-2xl" /> 
                  </button>
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")}
                    className="bg-blue-400 hover:bg-blue-500 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaTwitter className="text-2xl" />
                  </button>
                  <button
                    onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaInstagram className="text-2xl" />
                  </button>
                  <button
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank")}
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaWhatsapp className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
