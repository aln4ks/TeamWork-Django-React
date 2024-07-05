import React, { useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/log-reg.css'
import { X } from 'phosphor-react'

export default function Login ({onClose}) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });

    // Изменения в полях формы
    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    };

    // Отправка формы на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isLoading){
            return
        }

        setIsLoading(true);

        // Запрос на авторизацию
        try{
            const response = await axios.post("http://127.0.0.1:8000/login/", formData)
            toast.success("Вы успешно вошли в систему!");

            setTimeout(() => {
                navigate("/user-profile");
            }, 1000);

            sessionStorage.setItem("accessToken", response.data["jwt_token"]);
        }
        catch(error) {
            // Вывод ошибок с сервера
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

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    return (
        <div>
            {isOverlayVisible && <div className="overlay" onClick={closeModal} />}
            <form className="form">
                <X size={30} onClick={closeModal} className="close-log-reg"></X>
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