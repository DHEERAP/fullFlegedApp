import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import aiService from "../appwrite/aiService";
import { Button, Container, Input } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaEdit, FaTrash, FaRobot, FaBrain, FaLightbulb, FaComment, FaUser, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';

export default function Post() {
  const [post, setPost] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;
  const hasLiked = post && userData ? post.likedBy?.includes(userData.$id) : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          // Fetch comments for this post
          appwriteService.getComments(post.$id).then((response) => {
            if (response) {
              setComments(response.documents);
            }
          });
        } else {
          setError("Failed to fetch post. You may not have permission to view or update this post.");
          // Optionally, comment out the redirect for debugging:
          // navigate("/");
        }
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userData) return;

    setCommentLoading(true);
    setError(null);
    try {
      const comment = await appwriteService.createComment({
        postId: post.$id,
        userId: userData.$id,
        content: newComment.trim(),
        userName: userData.name || "Anonymous"
      });

      if (comment) {
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.message.includes("Missing required parameter")) {
        setError("Configuration error: Comments collection not set up. Please contact the administrator.");
      } else {
        setError("Failed to add comment. Please try again.");
      }
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const success = await appwriteService.deleteComment(commentId);
      if (success) {
        setComments(comments.filter(comment => comment.$id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleLike = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    setLikeLoading(true);
    try {
      const updatedPost = await appwriteService.toggleLike(post.$id, userData.$id);
      if (updatedPost) {
        setPost(updatedPost);
      } else {
        setError("Failed to update like. Please check your permissions or try again.");
        console.error("toggleLike failed or returned null/false");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setError("Failed to update like. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  return post ? (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-blue-100">
      <Container>
        {/* Featured Image Section - Now visible for all posts */}
        <div className="relative">
          <div className="w-full flex justify-center mb-6 relative">
            <div className="w-full max-w-4xl relative">
              {post.featuredImage && (
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                />
              )}
              {/* Edit and Delete Buttons (stacked top-right) */}
              {isAuthor && (
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button
                      bgColor="bg-green-500"
                      className="hover:bg-green-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    bgColor="bg-red-500"
                    onClick={deletePost}
                    className="hover:bg-red-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </Button>
                </div>
              )}
              {/* Likes Section - below image, not overlapping */}
              <div className="flex items-center mt-4 ml-1">
                <button
                  onClick={handleLike}
                  aria-label={hasLiked ? "Unlike" : "Like"}
                  className={`transition-all duration-150 mr-2 text-2xl 
                    ${hasLiked ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400 hover:scale-110"}
                    focus:outline-none`}
                  disabled={likeLoading}
                >
                  {hasLiked ? <FaHeart /> : <FaRegHeart />}
                </button>
                <span className="text-gray-700 font-semibold text-lg transition-all duration-150">
                  {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                </span>
              </div>
            </div>
          </div>
        </div>

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

        {/* Comments Section */}
        <div className="w-full bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center space-x-3 mb-6 border-b pb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <FaComment className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
            <span className="text-gray-500 text-sm ml-2">({comments.length})</span>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
              <div key={comment.$id} className="flex space-x-3 group">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="relative group-hover:bg-gray-50 transition-all duration-300 rounded-lg">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-semibold text-sm text-gray-900">{comment.userName}</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 ml-0">
                      <span className="text-gray-500 text-xs">
                        {new Date(comment.createdAt * 1000).toLocaleDateString()}
                      </span>
                      {userData && (userData.$id === comment.userId || isAuthor) && (
                        <button
                          onClick={() => handleDeleteComment(comment.$id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaComment className="text-gray-400 text-2xl" />
                </div>
                <p className="text-lg font-medium">No comments yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          {userData ? (
            <form onSubmit={handleAddComment} className="mt-6 border-t pt-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 pr-20 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                    />
                    <Button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-white text-sm font-medium transition-all duration-300 ${
                        commentLoading || !newComment.trim()
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      }`}
                    >
                      {commentLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting
                        </div>
                      ) : (
                        'Post'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-6 border-t pt-6 text-center">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <FaUser className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-600 mb-2">Want to join the conversation?</p>
                <Link 
                  to="/login" 
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Login to Comment
                </Link>
              </div>
            </div>
          )}
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  ) : null;
}
