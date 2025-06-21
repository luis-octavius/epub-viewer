import App from './App.jsx'
import { createRoot } from 'react-dom/client'
import { 
    createBrowserRouter,
    RouterProvider,
} from 'react-router'
import Epub from './components/EpubArea';
import './index.css'
import Annotations from './components/Annotations';
import Home from './components/Home';
import Content from './components/Content';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "home", element: <Home /> },
            { path: "content", element: <Content /> },
            { path: "annotations", element: <Annotations /> },
            { path: "epub", element: <Epub />, loader: () => {
                const savedState = localStorage.getItem('epubState');
                return savedState ? JSON.parse(savedState) : null;
            } }
        ],
    },
])


createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
