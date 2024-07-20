import EditProfilePage from "../components/EditProfilePage";
import ErrorPage from "../components/ErrorPage";
import HomePage from "../components/HomePage";
import LinkPage from "../components/LinkPage";
import SuccessPage from "../components/SuccessPage";

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
    {
        path: "/success",
        element: <SuccessPage />,
    },
];

export default ROUTES;
