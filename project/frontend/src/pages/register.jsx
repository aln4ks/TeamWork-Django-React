import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/log-reg.css';
import { Helmet } from "react-helmet";

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        post: ""
    });

    const [postNames, setPostNames] = useState([]);

    useEffect(() => {
        const fetchPostNames = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-post-names/');
                setPostNames(response.data.post_names);
            } catch (error) {
            }
        };

        fetchPostNames();
    }, []);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.post) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/register/", formData);
        
            toast.success("Вы успешно зарегистрировались! Переходим на страницу авторизации");

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch(error) {
                if (error.response && error.response.data) {
                    Object.keys(error.response.data).forEach(field => {
                    const errorMessage = error.response.data[field];
                    if( errorMessage && errorMessage.length > 0){
                    errorMessage.forEach(msg => {
                        toast.error(msg);
                    });
                }
            });
        }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Helmet>
                <title>Регистрация</title>
            </Helmet>
            <form method="post" className="form">
                <div className="inputs">
                    <label htmlFor="first_name">Имя:</label><br />
                    <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="inputs">
                    <label htmlFor="last_name">Фамилия:</label><br />
                    <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div className="inputs">
                    <label htmlFor="email">Email:</label><br />
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="inputs">
                    <label htmlFor="password">Пароль:</label><br />
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="inputs">
                    <label htmlFor="post">Должность:</label><br />
                    <select name="post" id="post" value={formData.post} onChange={handleChange} required>
                        {postNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btnSubmit" disabled={isLoading} onClick={handleSubmit}>Зарегистрироваться</button>
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
    );
}
