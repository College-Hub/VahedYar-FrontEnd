﻿import { Fragment, useEffect } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from "../../Store/auth-slice";


import './auth.css'
const Auth = () => {
    const { isLoggedIn } = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const authStatus = params['*'];
    

    useEffect(() => {
        if (authStatus === "login") dispatch(authActions.userHadAccStatus(true));
        if (authStatus === "signup") dispatch(authActions.userHadAccStatus(false));
        dispatch(authActions.resetErrors());
    }, [authStatus]);

    return (
        <section id="authentication" className="">
            <div className="row justify-content-center custome-auth-header">
                <NavLink className="col-6 col-sm-4 text-center custome-tab" to="login">ورود</NavLink>
                <NavLink className="col-6 col-sm-4 text-center custome-tab" to="signup">عضویت</NavLink>
            </div>
            <div className="row justify-content-center">
                <Outlet />
            </div>
        </section>
    );
};

export default Auth; 