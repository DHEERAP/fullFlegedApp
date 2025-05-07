import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, RTE, Select } from '../index';
import appwriteService from '../appwrite/config';
import { generateSummary } from '../appwrite/gemini';
import { useDispatch } from 'react-redux';
import { addPost } from '../store/postSlice';

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
            category: post?.category || "",
        },
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (data) => {
        setLoading(true);
        setError("");
        try {
            let dbPost;
            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage,
                });
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    dbPost = await appwriteService.createPost({ ...data });
                    if (dbPost) {
                        dispatch(addPost(dbPost));
                    }
                }
            }
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-z\d\s-]/g, "")
                .replace(/\s+/g, "-");
        }
        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const handleGenerateSummary = async () => {
        const content = getValues("content");
        if (!content) {
            setError("Please add some content first");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const summary = await generateSummary(content);
            setValue("content", summary);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-full lg:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Select
                    options={["Technology", "Lifestyle", "Travel", "Food", "Health", "Fashion", "Sports", "Business", "Entertainment", "Education"]}
                    label="Category"
                    className="mb-4"
                    {...register("category", { required: true })}
                />
                <Button
                    type="button"
                    bgColor="bg-green-500"
                    className="w-full mb-4"
                    onClick={handleGenerateSummary}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Summary with AI"}
                </Button>
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
                {error && (
                    <div className="text-red-500 mt-4 text-center">
                        {error}
                    </div>
                )}
            </div>
 