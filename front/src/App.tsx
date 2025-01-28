import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import PersistLogin from './components/persistLogin';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>();

  const PrivateRoutes = () => {
    return (
      <div className='private-routes'>
        {isLoggedIn !== false ? (
          <Routes>
            <Route element={<PersistLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
              <Route path="/home" element={   
                  <>     
                    <Navbar />     
                    <Home />   
                  </> 
                }/>
              <Route path="/profile/:id" element={
                  <>
                    <Navbar />
                    <Profile />
                  </>
                }/>
            </Route>
          </Routes>
        ) : (
          <Navigate to="/login" />
        )}
      </div>
    );
  };


  
  return (
    <Router>
      <Routes>

        {/* Private Routes */}
        <Route path='/*' element={<PrivateRoutes />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      
      </Routes>
    </Router>
  );
}

export default App;