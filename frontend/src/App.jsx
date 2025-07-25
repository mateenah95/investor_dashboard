import {RouterProvider} from "react-router";
import AppRouter from './Router.jsx';
import { UserContext } from "./contexts/UserContext.js";
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import React from 'react';


function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={AppRouter} />
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </UserContext.Provider>
    </div>
  )
}

export default App
