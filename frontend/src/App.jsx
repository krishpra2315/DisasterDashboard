import './App.css'
import Home from './pages/Home.jsx';
import Hurricane from './pages/Hurricane.jsx'

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
