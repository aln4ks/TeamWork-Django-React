import React, { useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/log-reg.css'
import { Helmet } from "react-helmet";


export default function Login () {
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });

    const navigate = useNavigate();

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isLoading){
            return
        }

        setIsLoading(true);

        try{
            const response = await axios.post("http://127.0.0.1:8000/login/", formData)
            toast.success("Вы успешно вошли в систему!");

            setTimeout(() => {
                navigate("/user-profile");
            }, 1000);

            sessionStorage.setItem("accessToken", response.data["jwt_token"]);
        }
        catch(error) {
            if(error.response && error.response.data){
                Object.keys(error.response.data).forEach(field => {
                    const errorMessage = error.response.data[field];
                    if(errorMessage && errorMessage.length > 0) {
                        toast.error(errorMessage);
                    }
                })
            }
        }
        finally{
            setIsLoading(false)
        }
    };

    return (
        <div>
            <Helmet>
                <title>Авторизация</title>
            </Helmet>
            <form className="form">
                <div className="inputs">
                    <label htmlFor="email">Email:</label><br />
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}/>{""}
                </div>
                <div className="inputs">
                    <label htmlFor="password">Пароль:</label><br />
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/>{""}
                </div>

                <button type="submit" className="btnSubmit" disabled={isLoading} onClick={handleSubmit}>Войти</button>
            </form>
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
    )
}