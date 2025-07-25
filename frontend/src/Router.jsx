import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import { Link } from 'react-router-dom';
import { CircleArrowLeft } from 'lucide-react';

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "*",
    element: <Login />,
  }
]);

export default AppRouter;