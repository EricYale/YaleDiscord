import EditProfilePage from "../components/EditProfilePage";
import ErrorPage from "../components/ErrorPage";
import HomePage from "../components/HomePage";
import LinkPage from "../components/LinkPage";

const ROUTES = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/link/:token?",
        element: <LinkPage />,
    },
    {
        path: "/profile/:token?",
        element: <EditProfilePage />,
    },
    {
        path: "/error/:code?",
        element: <ErrorPage />,
    },
];

export default ROUTES;
