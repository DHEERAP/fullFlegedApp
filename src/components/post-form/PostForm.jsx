import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from "../../appwrite/config"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function PostForm({post}) {

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({

        defaultValues: {

            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',

        },
    });

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);



    const submit = async (data) => {

        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,

                
            }); 
            if(dbPost) {
                navigate(`/post/${dbPost.$id}`);
                // navigate('/post/all-posts');
            }


            
        }

        else {
            const file = await appwriteService.uploadFile(data.image[0]);
            if (file) {
                const fileId = file.$id;

                data.featuredImage = fileId;

                const dbPost = await appwriteService.createPost({
                    ...data,
                            userId: userData.$id,
                })
                if (dbPost) {
                    navigate(`/post/all-posts`);
                }
                
            }
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



    React. useEffect(() => {
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
    

    return (



<form onSubmit={handleSubmit(submit)} className="flex flex-wrap bg-white p-8 rounded-lg shadow-2xl max-w-5xl mx-auto">
    {/* Header Section with Clear Explanation */}
    <div className="w-full text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {post ? "Update Your Post" : "Create a New Post"}
        </h2>
        <p className="text-lg text-gray-600">
            {post ? "Modify your post details below. You can change the content, image, and status." : "Fill out the form below to create a new post. Make sure to add an image and content."}
        </p>
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
                defaultValue={getValues("content")}
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
    </div>
</form>

 
    )

}
export default PostForm






