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
//         <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
//         <div className="w-2/3 px-2">
//             <Input
//                 label="Title :"
//                 placeholder="Title"
//                 className="mb-4"
//                 {...register("title", { required: true })}
//             />
//             <Input
//                 label="Slug :"
//                 placeholder="Slug"
//                 className="mb-4"
//                 {...register("slug", { required: true })}
//                 onInput={(e) => {
//                     setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
//                 }}
//             />
//             <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
//         </div>
//         <div className="w-1/3 px-2">
//             <Input
//                 label="Featured Image :"
//                 type="file"
//                 className="mb-4"
//                 accept="image/png, image/jpg, image/jpeg, image/gif"
//                 {...register("image", { required: !post })}
//             />
//             {post && (
//                 <div className="w-full mb-4">
//                     <img
//                         src={appwriteService.getFilePreview(post.featuredImage)}
//                         alt={post.title}
//                         className="rounded-lg"
//                     />
//                 </div>
//             )}
//             <Select
//                 options={["active", "inactive"]}
//                 label="Status"
//                 className="mb-4"
//                 {...register("status", { required: true })}
//             />
     
// <Button
//     type="submit"
//     bgColor={post ? "bg-green-500" : "bg-blue-500"}
//     className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out ${
//         post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
//     } hover:scale-105 hover:shadow-lg`}
// >
//     {post ? "Update" : "Submit"}
// </Button>
//         </div>
//     </form>
//     )



<form onSubmit={handleSubmit(submit)} className="flex flex-wrap bg-gray-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
    {/* Left Section: Title, Slug, and Content */}
    <div className="w-full md:w-2/3 px-2 space-y-4">
        <Input
            label="Title :"
            placeholder="Enter title"
            className="mb-4 shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-400 rounded-lg"
            {...register("title", { required: true })}
        />
        <Input
            label="Slug :"
            placeholder="Enter slug"
            className="mb-4 shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-400 rounded-lg"
            {...register("slug", { required: true })}
            onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
            }}
        />
        <RTE
            label="Content :"
            name="content"
            control={control}
            defaultValue={getValues("content")}
            className="border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 p-4"
        />
    </div>

    {/* Right Section: Image Upload, Status, and Submit Button */}
    <div className="w-full md:w-1/3 px-2 space-y-6">
        <Input
            label="Featured Image :"
            type="file"
            className="mb-4 p-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-400 transition"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
        />
        {post && (
            <div className="w-full mb-4 flex justify-center">
                <img
                    src={appwriteService.getFilePreview(post.featuredImage)}
                    alt={post.title}
                    className="rounded-lg shadow-lg border-2 border-gray-200 max-h-32"
                />
            </div>
        )}
        <Select
            options={["active", "inactive"]}
            label="Status"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            {...register("status", { required: true })}
        />

        {/* Submit Button with Transition and Hover Effects */}
        <Button
            type="submit"
            bgColor={post ? "bg-green-500" : "bg-blue-500"}
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
            } hover:scale-105 hover:shadow-lg`}
        >
            {post ? "Update" : "Submit"}
        </Button>
    </div>
</form>

 
    )

}
export default PostForm






