



  import React, { useState, useEffect } from 'react';
  import { Container, PostCard } from "../components";
  import appwriteService from "../appwrite/config";
  import { Link } from 'react-router-dom';
  import authService from "../appwrite/auth"; // Assuming this is the path to your authService

  function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
      // Get the current logged-in user ID
      authService.getCurrentUser().then((user) => {
        if (user) {
          setCurrentUserId(user.$id);
        }
      });

      // Fetch all posts
      appwriteService.getPosts([]).then((posts) => {
        if (posts) {
          setPosts(posts.documents);
        }
      });
    }, []);

    return (
      <div className="w-full py-20">
        <Container>
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            All Posts
          </h2>

          <div className="flex flex-wrap mb-12">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transform transition-all duration-300 hover:scale-105 hover:rounded-lg hover:shadow-xl hover:border-gray-300 relative"
              >
                {/* Post Card */}
                <PostCard {...post} />

                {/* Status Tag */}
                <div className={`absolute top-2 right-2 py-1 px-3 text-white font-semibold rounded-full ${
                  post.status === 'active' ? 'bg-green-500' : 'bg-red-400'
                }`}>
                  {post.status === 'active' ? 'Active' : 'Not Active'}
                </div>

                {/* "Your Post" Tag */}
                {currentUserId === post.userId && (
                  <div className="absolute bottom-2 left-2 py-1 px-3 text-white bg-blue-500 font-semibold rounded-full">
                    Your Post
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Back to Home Transparent Button */}
          <div className="flex justify-center mt-8">
            <Link to="/" className="flex items-center space-x-2">
              <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-gradient-to-l hover:from-blue-600 hover:to-blue-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out shadow-md">
                Back to Home
              </button>
              <span className="text-blue-500 text-xl">→</span>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  export default AllPosts;
