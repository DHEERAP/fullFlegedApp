

import conf from '../conf/conf.js';                                     

import { Client, ID, Databases, Storage, Query } from "appwrite";
import { jsPDF } from "jspdf";
import parse from "html-react-parser";
import ReactDOM from 'react-dom';


export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);

    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )

        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {

        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {

                    title,
                    content,
                    featuredImage,
                    status,

                }
            )

        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug) {
        try {

            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;

        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )

        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);

            return false;
        }

    }


    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }


//////// file upload section
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            ) 


        } catch (error) {
            console.log("Appwrite service :: uplaodFile :: error", error);

            return false;
        }
    }

    async deleteFile(fileId) {

        try {
             await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);

            return false;
        }

    }




    // async downloadFile(fileId) {
    //     try {
    //          const file = await this.bucket.getFileDownload(
    //             conf.appwriteBucketId,
    //             fileId,
    //         )

    //     } catch (error) {
    //         console.log("Appwrite service :: deleteFile :: error", error);
    //     }

    // }
  




    async downloadFile(fileId, title, content, imageUrl) {
        try {
            // Initialize jsPDF
            const pdf = new jsPDF();
    
            // Add Title
            pdf.setFontSize(20);
            pdf.text(title, 10, 10);
    
            // Fetch and Add Image (if exists)
            if (imageUrl) {
                const imgResponse = await fetch(imageUrl); // Fetch image from the provided URL
                const imgBlob = await imgResponse.blob(); // Convert the image to a Blob
                const imgBase64 = await this.convertBlobToBase64(imgBlob); // Convert Blob to Base64
                pdf.addImage(imgBase64, "JPEG", 10, 20, 180, 100); // Add the image to the PDF
            }



//             const file = await this.bucket.getFileDownload(conf.appwriteBucketId, fileId);  // Get image from the bucket
// // const imgResponse = await fetch(file.href);  // Fetch the image
// const imgBlob = await imgResponse.blob();  // Convert to Blob
// const imgBase64 = await this.convertBlobToBase64(imgBlob);  // Convert to base64
// pdf.addImage(imgBase64, "JPEG", 10, 20, 180, 100);  // Add image to PDF
    
            // Parse and Add Content (Text)
            const parsedContent = parse(content);
    
            let contentText = "";
            if (parsedContent && typeof parsedContent === "object") {
                // Create a temporary div and append the parsed content
                const tempDiv = document.createElement("div");
                ReactDOM.render(parsedContent, tempDiv); // Use ReactDOM to render parsed content
    
                // Extract the inner text from the temporary div (removes HTML tags)
                contentText = tempDiv.innerText || tempDiv.textContent;
            } else {
                contentText = content; // Use original content if no parsing is needed
            }
    
            // Add content text to the PDF
            pdf.setFontSize(12);
            pdf.text(contentText, 10, 130); // Adjust position for content
    
            // Save the PDF file
            pdf.save(`${title}.pdf`);
        } catch (error) {
            console.error("Appwrite service :: downloadFile :: error", error);
        }
    }
    
    // Helper function to convert Blob to Base64
    convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob); // Converts the image Blob to Base64
        });
    }
    

         getFilePreview(fileId) {

            return this.bucket.getFilePreview(
                conf.appwriteBucketId,
                    fileId
            )
         }

}

const service = new Service();
export default service;















// import conf from '../conf/conf.js';                                     

// import { Client, ID, Databases, Storage, Query } from "appwrite";

// export class Service {
//     client = new Client();
//     databases;
//     bucket;

//     constructor() {
//         this.client
//             .setEndpoint(conf.appwriteUrl)
//             .setProject(conf.appwriteProjectId);

//         this.databases = new Databases(this.client);
//         this.bucket = new Storage(this.client);

//     }

//     async createPost({ title, slug, content, featuredImage, status, userId }) {
//         try {
//             return await this.databases.createDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage,
//                     status,
//                     userId,
//                 }
//             )

//         } catch (error) {
//             console.log("Appwrite service :: createPost :: error", error);
//         }
//     }

//     async updatePost(slug, { title, content, featuredImage, status }) {

//         try {
//             return await this.databases.updateDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {

//                     title,
//                     content,
//                     featuredImage,
//                     status,

//                 }
//             )

//         } catch (error) {
//             console.log("Appwrite service :: updatePost :: error", error);
//         }
//     }


//     async deletePost(slug) {
//         try {

//             await this.databases.deleteDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug
//             )
//             return true;

//         } catch (error) {
//             console.log("Appwrite service :: deletePost :: error", error);
//             return false;
//         }
//     }


//     async getPost(slug) {
//         try {
//             return await this.databases.getDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug
//             )

//         } catch (error) {
//             console.log("Appwrite service :: getPost :: error", error);

//             return false;
//         }

//     }





//     async getPosts(queries = [Query.equal("status", "active")]) {
//         try {
//             return await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 queries,
//             )
//         } catch (error) {
//             console.log("Appwrite service :: getPosts :: error", error);
//             return false;
//         }
//     }






// //////// file upload section

//     async uploadFile(file) {
//         try {
//             return await this.bucket.createFile(
//                 conf.appwriteBucketId,
//                 ID.unique(),
//                 file
//             ) 


//         } catch (error) {
//             console.log("Appwrite service :: uplaodFile :: error", error);

//             return false;
//         }
//     }


//     async deleteFile(fileId) {

//         try {
//              await this.bucket.deleteFile(
//                 conf.appwriteBucketId,
//                 fileId,
//             )
//             return true;
//         } catch (error) {
//             console.log("Appwrite service :: deleteFile :: error", error);

//             return false;
//         }

//     }


//          getFilePreview(fileId) {

//             return this.bucket.getFilePreview(
//                 conf.appwriteBucketId,
//                     fileId
//             )
//          }



// }

// const service = new Service();
// export default service;





