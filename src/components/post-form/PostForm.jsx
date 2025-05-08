import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from "../../appwrite/config"
import aiService from "../../appwrite/aiService"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaRobot, FaLightbulb } from 'react-icons/fa'

function PostForm({post}) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    });

    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [error, setError] = useState('');
    const [editorContent, setEditorContent] = useState(post?.content || '');

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);

    const generateAISuggestions = async () => {
        if (!topic.trim()) return;
        
        setIsGenerating(true);
        try {
            const model = aiService.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Write a very concise paragraph about "${topic}" that could be used in a blog post. The paragraph MUST be less than 255 characters. Focus on the most important points and keep it brief.`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();
            
            // Ensure the generated content is within limits
            const truncatedText = text.length > 255 ? text.substring(0, 252) + '...' : text;
            setAiSuggestions([truncatedText]);
        } catch (error) {
            console.error('Error generating suggestions:', error);
            setError('Failed to generate AI suggestions. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const processContent = (content) => {
        let processedContent = String(content || '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&mdash;/g, '—')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        processedContent = processedContent.replace(/<[^>]*>/g, '');

        if (processedContent.length > 255) {
            processedContent = processedContent.substring(0, 252) + '...';
        }

        return processedContent;
    };

    const applySuggestion = (suggestion) => {
        const currentContent = editorContent || '';
        const newContent = currentContent ? `${currentContent}\n\n${suggestion}` : suggestion;
        const processedContent = processContent(newContent);
        setEditorContent(processedContent);
    };

    const handleEditorChange = (content) => {
        setEditorContent(processContent(content));
    };

    const submit = async (data) => {
        try {
            const latestContent = processContent(editorContent || data.content);
            
            const formData = {
                ...data,
                content: latestContent
            };

            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...formData,
                    featuredImage: file ? file.$id : post.featuredImage,
                }); 
                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    const fileId = file.$id;
                    formData.featuredImage = fileId;

                    const dbPost = await appwriteService.createPost({
                        ...formData,
                        userId: userData.$id,
                    });
                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            setError(error.message || "Failed to submit post. Please try again.");
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value == 'string')
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === 'title') {
                setValue('slug', slugTransform(value.title, 
                    {shouldValidate: true}
                ));
            }
        });
    
      return () => {
         subscription.unsubscribe();
      }
    }, [watch, slugTransform, setValue])
    
    React.useEffect(() => {
        setValue('content', editorContent, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    }, [editorContent, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap bg-white p-8 rounded-lg shadow-2xl max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="w-full text-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                    {post ? "Update Your Post" : "Create a New Post"}
                </h2>
                <p className="text-lg text-gray-600">
                    {post ? "Modify your post details below." : "Fill out the form below to create a new post."}
                </p>
            </div>

            {/* AI Suggestion Section */}
            <div className="w-full mb-8 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                            <FaRobot className="text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">AI Content Suggestions Assistant </h3>
                    </div>
                </div>
                
                <div className="flex gap-4 mb-4">
                    <Input
                        placeholder="Enter a topic for AI suggestions"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={generateAISuggestions}
                        disabled={isGenerating || !topic.trim()}
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
                            isGenerating ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        }`}
                    >
                        {isGenerating ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <FaLightbulb className="mr-2" />
                                Generate Paragraph
                            </span>
                        )}
                    </Button>
                </div>

                {aiSuggestions && aiSuggestions.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Generated Paragraph:</h4>
                        <div className="space-y-4">
                            {aiSuggestions.map((suggestion, index) => (
                                <div key={index} className="group">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">
                                            {suggestion}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => applySuggestion(suggestion)}
                                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center"
                                    >
                                        <FaLightbulb className="mr-2" />
                                        Add to Content
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Left Section: Title, Slug, and Content */}
            <div className="w-full md:w-2/3 px-4 space-y-6">
                <div className="space-y-2">
                    <label className="text-lg text-gray-800">Title :</label>
                    <Input
                        placeholder="Enter title"
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                        {...register("title", { required: true })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-lg text-gray-800">Slug :</label>
                    <Input
                        placeholder="Enter slug"
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-lg text-gray-800">Content :</label>
                    <RTE
                        name="content"
                        control={control}
                        defaultValue={editorContent}
                        onEditorChange={handleEditorChange}
                        className="w-full p-6 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                    />
                </div>
            </div>

            {/* Right Section: Image Upload, Status, and Submit Button */}
            <div className="w-full md:w-1/3 px-4 space-y-6">
                <div className="space-y-2">
                    <label className="text-lg text-gray-800">Featured Image :</label>
                    <Input
                        type="file"
                        className="w-full p-4 border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4 flex justify-center">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg shadow-lg border-2 border-gray-200 max-h-40 object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-lg text-gray-800">Status :</label>
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        {...register("status", { required: true })}
                    />
                </div>

                {/* Submit Button with Enhanced Hover and Animation Effects */}
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : "bg-blue-500"}
                    className={`w-full text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out ${
                        post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                    } hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-blue-500`}
                >
                    {post ? "Update" : "Submit"}
                </Button>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-center">{error}</p>
                    </div>
                )}
            </div>
        </form>
    )
}
export default PostForm






