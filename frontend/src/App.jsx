import './App.css'
import Hurricanes from './pages/./Hurricanes.jsx';
import Hurricane from './pages/Hurricane.jsx';
import Home from './pages/Home.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/hurricanes",
        element: <Hurricanes />
    },
    {
        path: "/hurricanes/:name",
        element: <Hurricane />
    }
])

function App() {

    return (
        <RouterProvider router={router} />
    )
}

export default App
