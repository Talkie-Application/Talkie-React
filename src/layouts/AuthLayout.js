import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context as UserIdContext } from '../contexts/UserIdContext';

export const AuthLayout = () => {
    const userId = useContext(UserIdContext);

    if (!userId.state) {
        return <Navigate to='/login' />;
    }

    return (
        <Outlet />
    );
}