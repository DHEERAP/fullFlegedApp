import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { FaSearch, FaFilter, FaPlus, FaStar, FaClock, FaFire, FaArrowRight, FaPenFancy } from "react-icons/fa";
import { useSelector } from 'react-redux'
import authService from "../appwrite/auth";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollContainerRef = useRef(null);
    const postsPerPage = 9;
    const [categories, setCategories] = useState([]);
    const authStatus = useSelector((state) => state.auth.status);
    const [currentUserId, setCurrentUserId] = useState(null);
    const userData = useSelector((state) => state.auth.userData);
    const userPosts = posts.filter(post => userData && post.userId === userData.$id);
    const [isPaused, setIsPaused] = useState(false);

    // Fake stories data for non-logged-in users
    const fakeStories = [
        {
            id: 1,
            title: "The Art of Mindful Living",
            content: "Discover how mindfulness can transform your daily life and bring peace to your mind.",
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: 2,
            title: "Digital Nomad Lifestyle",
            content: "Learn how to work remotely while exploring the world and maintaining productivity.",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: 3,
            title: "Sustainable Living Guide",
            content: "Simple steps to reduce your carbon footprint and live a more eco-friendly life.",
            image: "https://images.unsplash.com/photo-1464054313797-e27fb58e90a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: 4,
            title: "Tech Trends 2024",
            content: "Explore the latest technological innovations that are shaping our future.",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: 5,
            title: "Healthy Eating Habits",
            content: "Transform your diet with these simple and effective nutrition tips.",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
    ];

    useEffect(() => {
        // Get current user ID
        authService.getCurrentUser().then((user) => {
            if (user) {
                setCurrentUserId(user.$id);
            }
        });

        appwriteService.getPosts().then((posts) => {
            if (posts) {
                // Filter posts to show only current user's posts when logged in
                const filteredPosts = authStatus 
                    ? posts.documents.filter(post => post.userId === currentUserId)
                    : posts.documents;
                
                setPosts(filteredPosts);
                setFilteredPosts(filteredPosts);
                const uniqueCategories = [...new Set(filteredPosts.map(post => post.category || "Uncategorized"))];
                setCategories(["all", ...uniqueCategories]);
            }
            setLoading(false);
        });
    }, [authStatus, currentUserId]);

    // Auto-scroll effect for horizontal posts
    useEffect(() => {
        let animationFrame;
        let timeout;
        let scrollAmount = 2; // Adjust for speed

        function startAutoScroll() {
            const container = scrollContainerRef.current;
            if (!container) {
                // Ref not ready, try again shortly
                timeout = setTimeout(startAutoScroll, 100);
                return;
            }
            if (container.scrollWidth <= container.clientWidth) {
                // Not scrollable, do nothing
                return;
            }
            function autoScroll() {
                if (!isPaused) {
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                        container.scrollLeft = 0;
                    } else {
                        container.scrollLeft += scrollAmount;
                    }
                }
                animationFrame = requestAnimationFrame(autoScroll);
            }
            animationFrame = requestAnimationFrame(autoScroll);
        }

        if (!authStatus) {
            startAutoScroll();
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (timeout) clearTimeout(timeout);
        };
    }, [authStatus, isPaused]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollPosition;
        }
    }, [scrollPosition]);

    useEffect(() => {
        let filtered = [...posts];

        // Apply search filter
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter((post) => post.category === selectedCategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.$createdAt) - new Date(a.$createdAt);
                case "oldest":
                    return new Date(a.$createdAt) - new Date(b.$createdAt);
                case "popular":
                    return (b.views || 0) - (a.views || 0);
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [searchQuery, posts, selectedCategory, sortBy]);

    // Get current posts for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-20 bg-gradient-to-b from-gray-50 to-blue-100">
            <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
                {/* Add New Post Section for users with no posts */}
                {userData && userPosts.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center mb-12">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-1 rounded-3xl shadow-xl w-full max-w-xl">
                            <div className="bg-white rounded-3xl p-8 flex flex-col items-center">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full mb-4 shadow-lg">
                                    <FaPenFancy className="text-white text-3xl" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create your first post!</h2>
                                <p className="text-gray-600 mb-6 text-center">Share your thoughts, stories, or expertise with the world. Start building your audience today.</p>
                                <Link to="/add-post">
                                    <Button
                                        bgColor="bg-gradient-to-r from-blue-500 to-purple-600"
                                        className="hover:from-blue-600 hover:to-purple-700 transition-all duration-300 px-8 py-3 rounded-full text-white text-lg shadow-lg flex items-center gap-2"
                                    >
                                        <FaPenFancy className="text-white mr-2" />
                                        Create Post
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Hero Section for Non-Logged In Users */}
                        {!authStatus && (
                            <div className="w-full">
                                <div className="relative overflow-hidden w-full">
                                    {/* Hero Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"></div>
                                    
                                    {/* Hero Content */}
                                    <div className="relative text-center mb-16 py-16">
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center px-2">
                                            Welcome to BlogApp
                                        </h1>
                                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-full sm:max-w-2xl mx-auto text-center px-2">
                                            Discover amazing stories, share your thoughts, and connect with a community of passionate writers.
                                        </p>
                                        <div className="flex justify-center gap-6">
                                            <Link to="/login" className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-105 shadow-lg">
                                                Get Started
                                            </Link>
                                            <Link to="/signup" className="bg-white text-blue-500 px-8 py-3 rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
                                                Join Our Community
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Auto-scrolling Posts Section with Fake Stories */}
                                    <div className="mb-4 sm:mb-6 md:mb-16 w-full">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8">Trending Stories</h2>
                                        <div 
                                            ref={scrollContainerRef}
                                            className="flex overflow-x-auto gap-2 sm:gap-4 md:gap-6 py-2 sm:py-4 w-full snap-x snap-mandatory"
                                            style={{ scrollBehavior: 'smooth' }}
                                            onMouseEnter={() => setIsPaused(true)}
                                            onMouseLeave={() => setIsPaused(false)}
                                            onTouchStart={() => setIsPaused(true)}
                                            onTouchEnd={() => setIsPaused(false)}
                                        >
                                            {fakeStories.map((story) => (
                                                <div 
                                                    key={story.id}
                                                    className="flex-shrink-0 w-56 sm:w-64 md:w-80 bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 snap-center"
                                                >
                                                    <img 
                                                        src={story.image} 
                                                        alt={story.title}
                                                        className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                                                    />
                                                    <div className="p-2 sm:p-4">
                                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2">{story.title}</h3>
                                                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-2 sm:mb-4">{story.content}</p>
                                                        <Link 
                                                            to="/login"
                                                            className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center"
                                                        >
                                                            Read More <FaArrowRight className="ml-2" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Duplicate stories for seamless scrolling */}
                                            {fakeStories.map((story) => (
                                                <div 
                                                    key={`duplicate-${story.id}`}
                                                    className="flex-shrink-0 w-56 sm:w-64 md:w-80 bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 snap-center"
                                                >
                                                    <img 
                                                        src={story.image} 
                                                        alt={story.title}
                                                        className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                                                    />
                                                    <div className="p-2 sm:p-4">
                                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2">{story.title}</h3>
                                                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-2 sm:mb-4">{story.content}</p>
                                                        <Link 
                                                            to="/login"
                                                            className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center"
                                                        >
                                                            Read More <FaArrowRight className="ml-2" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Why Join Section */}
                                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 mb-4 sm:mb-6 md:mb-16 w-full">
                                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8">Why Join BlogApp?</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-8">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FaSearch className="text-blue-500 text-2xl" />
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">Discover Stories</h3>
                                                <p className="text-gray-600">Find amazing content from our community of writers</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FaPlus className="text-purple-500 text-2xl" />
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">Share Your Voice</h3>
                                                <p className="text-gray-600">Create and share your own stories with the world</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FaFilter className="text-green-500 text-2xl" />
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                                                <p className="text-gray-600">Engage with other writers and readers</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posts Grid for Logged In Users */}
                        {authStatus && (
                            <>
                                <div className="mb-8">
                                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Search your posts..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                        </div>

                                        <div className="flex gap-4">
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All Categories</option>
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                            </select>

                                            <Link to="/add-post" className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                                                <FaPlus />
                                                New Post
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-wrap'>
                                    {currentPosts.map((post) => (
                                        <div key={post.$id} className='p-2 w-full sm:w-1/2 lg:w-1/3'>
                                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                                <PostCard {...post} showTags={false} />
                                                <div className="p-4">
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                                                    <div className="text-gray-500 text-sm mb-3 line-clamp-[2.5] h-[3.75rem]">
                                                        {post.content.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—')}
                                                    </div>
                                                    <Link 
                                                        to={`/post/${post.$id}`}
                                                        className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
                                                    >
                                                        Read More <FaArrowRight className="ml-2" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;