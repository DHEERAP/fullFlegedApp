// import React from 'react'
// import { LogoutBtn, Logo, Container } from "../index";
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';



// function Header() {


//   const authStatus = useSelector((state) => state.auth.status)
//   const navigate = useNavigate()

//   const navItems = [
//     {
//       name: 'Home',
//       slug: "/",
//       active: true
//     },
//     {
//       name: "Login",
//       slug: "/login",
//       active: !authStatus,
//     },
//     {
//       name: "Signup",
//       slug: "/signup",
//         active: !authStatus,
//     },
//     {
//       name: "All Posts",
//       slug: "/all-posts",
//       active: authStatus,
//     },
//     {
//       name: "Add Post",
//       slug: "/add-post",
//       active: authStatus,
//     },
//   ]




//   return (
//     <header className='py-3 shadow bg-gray-500'>
//       <Container>
//         <nav className='flex'>
//           <div className='mr-4'>
//             <Link to='/'>
//               <Logo width='70px' />
//             </Link>
//           </div>

//           <ul className='flex ml-auto'>
//             {navItems.map((item) =>
//               item.active ? (
//                 <li key={item.name}>
//                   <button
//                     onClick={() => navigate(item.slug)}
//                     className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
//                     {item.name}
//                     </button>
//                 </li>
//               ) : null
//             )}

//   {authStatus && (
//        <li>
//            <LogoutBtn /> 
//        </li>
//   )
//   }

//           </ul>
//         </nav>
//       </Container>
//     </header>

//   )
// }

// export default Header 





import React, { useState } from 'react';
import { LogoutBtn, Logo, Container } from "../index";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gray-500 shadow py-3">
      <Container>
        <nav className="flex items-center justify-between relative">
          {/* Logo */}
          <Link to="/">
            <Logo width="70px" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex ml-auto space-x-4">
            {navItems.map((item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="px-4 py-2 hover:bg-blue-100 rounded text-white">
                    {item.name}
                  </button>
                </li>
              )
            )}
            {authStatus && <LogoutBtn />}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Mobile Navigation (dropdown appears below when hovering) */}
          {menuOpen && (
            <ul
              className="absolute top-full right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-2 w-max"
            >
              {navItems.map((item) =>
                item.active && (
                  <li key={item.name} className="whitespace-nowrap">
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setMenuOpen(false); // Close menu on navigation
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {item.name}
                    </button>
                  </li>
                )
              )}
              {authStatus && (
                <li>
                  <LogoutBtn />
                </li>
              )}
            </ul>
          )}
        </nav>
      </Container>
    </header>
  );
}

export default Header;





