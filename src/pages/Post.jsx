import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaRobot, FaLightbulb, FaBookReader } from 'react-icons/fa';

export default function Post() {
  const [post, setPost] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [summary, setSummary] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          // Analyze sentiment
          analyzeSentiment(post.content);
          // Generate summary
          generateSummary(post.content);
          // Get related posts
          getRelatedPosts(post);
        } else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [navigate, slug]);

  const analyzeSentiment = async (content) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Analyze the sentiment of this text and return only one word (positive, negative, or neutral): ${content}`
          }]
        })
      });
      const data = await response.json();
      setSentiment(data.choices[0].message.content.toLowerCase());
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  const generateSummary = async (content) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Summarize this text in 2-3 sentences: ${content}`
          }]
        })
      });
      const data = await response.json();
      setSummary(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const getRelatedPosts = async (currentPost) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Suggest 3 related topics or keywords for this post: ${currentPost.title} - ${currentPost.content}`
          }]
        })
      });
      const data = await response.json();
      const keywords = data.choices[0].message.content.split(',');
      // Here you would typically fetch posts matching these keywords from your database
      // For now, we'll just set some placeholder related posts
      setRelatedPosts([
        { id: 1, title: "Related Topic 1", slug: "related-topic-1" },
        { id: 2, title: "Related Topic 2", slug: "related-topic-2" },
        { id: 3, title: "Related Topic 3", slug: "related-topic-3" }
      ]);
    } catch (error) {
      console.error('Error getting related posts:', error);
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
            {/* Image Section */}
            <div className="w-full flex justify-center mb-6 relative border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-full h-96 object-cover rounded-xl"
              />

              {/* Edit and Delete Buttons */}
              <div className="absolute top-4 right-4 flex flex-col space-y-3">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button
                    bgColor="bg-green-500"
                    className="hover:bg-green-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </Button>
                </Link>
                <Button
                  bgColor="bg-red-500"
                  onClick={deletePost}
                  className="hover:bg-red-600 transition-all duration-300 px-4 py-2 rounded-full text-white text-lg shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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

        {/* AI Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sentiment Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FaRobot className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold">Sentiment Analysis</h3>
            </div>
            {sentiment && (
              <div className={`p-3 rounded-lg ${
                sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Sentiment
              </div>
            )}
          </div>

          {/* Content Summary */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-yellow-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold">AI Summary</h3>
            </div>
            {summary && (
              <p className="text-gray-700">{summary}</p>
            )}
          </div>

          {/* Related Posts */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FaBookReader className="text-purple-500 text-2xl mr-2" />
              <h3 className="text-xl font-semibold">Related Posts</h3>
            </div>
            <ul className="space-y-2">
              {relatedPosts.map((relatedPost) => (
                <li key={relatedPost.id}>
                  <Link 
                    to={`/post/${relatedPost.slug}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  >
                    {relatedPost.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
