import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
        setFilteredPosts(posts.documents);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-100 py-12">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing stories, insights, and ideas from our community of writers.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow max-w-2xl">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <Button
                bgColor="bg-blue-500"
                className="hover:bg-blue-600 transition-all duration-300 px-6 py-3 rounded-full text-white flex items-center"
              >
                <FaFilter className="mr-2" />
                Filter
              </Button>
              <Link to="/add-post">
                <Button
                  bgColor="bg-green-500"
                  className="hover:bg-green-600 transition-all duration-300 px-6 py-3 rounded-full text-white flex items-center"
                >
                  <FaPlus className="mr-2" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.$id}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                No Posts Found
              </h2>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "No posts match your search criteria."
                  : "There are no posts available at the moment."}
              </p>
              <Link to="/add-post">
                <Button
                  bgColor="bg-blue-500"
                  className="hover:bg-blue-600 transition-all duration-300 px-6 py-3 rounded-full text-white"
                >
                  Create Your First Post
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
