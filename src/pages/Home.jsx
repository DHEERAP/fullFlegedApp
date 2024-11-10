

// import React, { useEffect, useState } from 'react';
// import appwriteService from '../appwrite/config';
// import { Container, PostCard } from '../components';
// import { Link } from 'react-router-dom';


// function Home() {

//     const [posts, setPosts] = useState([]);   
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         appwriteService.getPosts().then((posts) => {
//             if (posts) {
//                 setPosts(posts.documents);
//             }
//             setLoading(false);
//         })

//     }, [])

//     //     if (posts.length === 0) {
//     //     return (
//     //         <div className="w-full py-8 mt-4 text-center">
//     //             <Container>
//     //                 <div className="flex flex-wrap">
//     //                     <div className="p-2 w-full">
//     //                         <h1 className="text-2xl font-bold hover:text-gray-500">
//     //                             Login to read posts
//     //                         </h1>
//     //                     </div>
//     //                 </div>
//     //             </Container>
//     //         </div>
//     //     )
//     // }


//     if (posts.length === 0) {
//         return (
     
//             <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
//               <h1 className="text-3xl font-extrabold text-gray-800 hover:text-blue-500 transition-colors duration-300 ease-in-out">
//                 Login to read posts
//               </h1>
//               <p className="mt-2 text-gray-600">
//                 Sign in to access exclusive content!
//               </p>
//               <div className="mt-4">
//                 <Link to="/login">
//                   <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition-all duration-300 ease-in-out">
//                     Login
//                   </button>
//                 </Link>
//               </div>
//             </div>
       
//         )
//       }
    
//     // return (
//     //     <div className='w-full py-8'>

//     //         <Container>
//     //             <div className='flex flex-wrap'>
//     //                 {posts.map((post) => (
//     //                     <div key={post.$id} className='p-2 w-1/4' >
//     //                         <PostCard {...post} />
//     //                     </div>
//     //                 ))
//     //                 }
//     //             </div>
//     //         </Container>
//     //     </div>
//     // )

//     return (
//       <div className='w-full py-8'>
//         <Container>
//           {loading ? (
//             // Display loading indicator while fetching posts
//             <div className="text-center py-8">
//               <span className="text-lg font-semibold">Loading posts...</span>
//             </div>
//           ) : (
//             <div className='flex flex-wrap'>
//               {posts.map((post) => (
//                 <div key={post.$id} className='p-2 w-1/4'>
//                   <PostCard {...post} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </Container>
//       </div>
//     );

  
// }

// export default Home






// import React, { useEffect, useState } from 'react';
// import appwriteService from '../appwrite/config';
// import { Container, PostCard } from '../components';
// import { Link } from 'react-router-dom';

// function Home() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     appwriteService.getPosts().then((posts) => {
//       if (posts) {
//         setPosts(posts.documents);
//       }
//       setLoading(false);
//     });
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-8">
//         <span className="text-lg font-semibold">Loading posts...</span>
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md text-center">
//         <h1 className="text-3xl font-extrabold text-gray-800 hover:text-blue-500 transition-colors duration-300 ease-in-out">
//           Login to read posts
//         </h1>
//         <p className="mt-2 text-gray-600">Sign in to access exclusive content!</p>
//         <div className="mt-4">
//           <Link to="/login">
//             <button className="px-6 py-2 border border-blue-500 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out">
//               Login
//             </button>
//           </Link>
//         </div>
//       </div>
//     );
//   }


 

//   return (
//     <div className="w-full py-10">
//       <Container>
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
//           Latest Posts
//         </h2>
//         <div className="flex flex-wrap mb-12">
//           {posts.map((post) => (
//             <div
//               key={post.$id}
//               className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transform transition-all duration-300 hover:scale-105 hover:rounded-lg hover:shadow-xl hover:border-gray-300"
//             >
//               <PostCard {...post} />
//             </div>
//           ))}
//         </div>

//         {/* Transparent Add Post & All Posts Buttons */}
//         <div className="flex justify-center space-x-4 mt-12">
//           <Link to="/add-post">
//             <button className="px-6 py-3 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-gradient-to-l hover:from-green-600 hover:to-green-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out shadow-md">
//               Add Your Post
//             </button>
//           </Link>
//           <Link to="/all-posts">
//             <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-gradient-to-l hover:from-blue-600 hover:to-blue-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out shadow-md">
//               All Posts
//             </button>
//           </Link>
//         </div>

//         {/* Decorative Section Divider */}
//         <div className="mt-16 flex justify-center">
//           <div className="w-20 h-1 bg-gradient-to-r from-gray-300 to-gray-500 rounded"></div>
//         </div>
//       </Container>
//     </div>
//   );
// }

// export default Home;








import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/config';
import { Container, PostCard } from '../components';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <span className="text-lg font-semibold">Loading posts...</span>
      </div>
    );
  }

    if (posts.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 hover:text-blue-500 transition-colors duration-300 ease-in-out">
          Login to read posts
        </h1>
        <p className="mt-2 text-gray-600">Sign in to access exclusive content!</p>
        <div className="mt-4">
          <Link to="/login">
            <button className="px-6 py-2 border border-blue-500 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out">
              Login
            </button>
          </Link>
        </div>
      </div>
    );
  }


 
  // Regular page rendering with posts
  return (
    <div className="w-full py-10 md:py-20">
      <Container>
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Latest Posts
        </h2>
        <div className="flex flex-wrap mb-12">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transform transition-all duration-300 hover:scale-105 hover:rounded-lg hover:shadow-xl hover:border-gray-300"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>

        {/* Transparent Add Post & All Posts Buttons */}
        <div className="flex justify-center space-x-4 mt-12">
          <Link to="/add-post">
            <button className="px-6 py-3 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-gradient-to-l hover:from-green-600 hover:to-green-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out shadow-md">
              Add Your Post
            </button>
          </Link>
          <Link to="/all-posts">
            <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-gradient-to-l hover:from-blue-600 hover:to-blue-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out shadow-md">
              All Posts
            </button>
          </Link>
        </div>

        {/* Decorative Section Divider */}
        <div className="mt-16 flex justify-center">
          <div className="w-20 h-1 bg-gradient-to-r from-gray-300 to-gray-500 rounded"></div>
        </div>
      </Container>
    </div>
  );
}

export default Home;
