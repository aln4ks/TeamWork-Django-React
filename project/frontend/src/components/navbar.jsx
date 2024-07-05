import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation, } from 'react-router-dom';
import { SignOut } from 'phosphor-react';

export const Navbar = () => {
    const [fullName, setFullName] = useState("");
    const [isLoggedin, setLoggedin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const hideNavbar = ['/login', '/register', '/', '/personal-data'].includes(location.pathname);

    useEffect(() => {
        if (hideNavbar) {
            return () => {}
        }
        const checkLoggedInUser = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (token) {
                try {
                    const config = {
                        headers: {
                            'token': token,
                        }
                    };
                    // Запрос на получение имени и фамилии пользователя
                    const response = await axios.get("http://127.0.0.1:8000/user-profile/", config);
                    setLoggedin(true);
                    setFullName(`${response.data.first_name} ${response.data.last_name}`);
                } catch (error) {
                    setLoggedin(false);
                    setFullName("");
                }
            } else {
                setLoggedin(false);
                setFullName("");
            }
        };

        checkLoggedInUser();

}, [isLoggedin, fullName]);

    // Выход из системы
    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        setFullName("");
        setLoggedin(false);

        toast.success("Вы вышли из системы, переходим на главную страницу");

            setTimeout(() => {
                navigate("/");
            }, 2000);
    };

    return (
        <div className="navbar">
            <h1></h1>

            {isLoggedin && (
                <div className="userInfo">
                    <p>{fullName}</p>
                    <button onClick={handleLogout}><SignOut size={30} /></button>
                </div>
            )}

            <ToastContainer 
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};
