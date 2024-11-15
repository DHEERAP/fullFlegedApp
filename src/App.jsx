 import React, {useState, useEffect} from 'react'
import './App.css'
import './index.css';
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Footer, Header } from './components'
import { Outlet  } from "react-router-dom";

function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
   
    authService.getCurrentUser()
    .then((userData) =>  {
      if(userData){
        dispatch(login({userData}))
      }
      else{
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false));
  }, [])


return !loading ? (  
          //  <div className='min-h-screen flex  flex-wrap content-between bg-gray-400'>
          //   <div className='w-full block'>

          //        <Header />
          //        <main>
          //        <Outlet />
          //        </main>
          //        <Footer />
 
          //   </div>
          //  </div>


          <div className="min-h-screen flex flex-col bg-gray-400">
    <Header />

    <main className="flex-grow flex justify-center items-center">
        <Outlet />
    </main>

    <Footer />
</div>
    
 ) : <div>Loding...</div>
}

export default App; 

