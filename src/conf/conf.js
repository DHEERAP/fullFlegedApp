const conf = {

    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID), // Corrected
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID), // Corrected
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID), // Corrected
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID), // Corrected
    

}
console.log("Appwrite Config:", conf);


export default conf;

