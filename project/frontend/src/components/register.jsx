import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/log-reg.css';
import { X } from 'phosphor-react'
import { Link } from "react-router-dom";

export default function Register({onClose}) {
    const [isPersonalData, setIsPersonalData] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [postNames, setPostNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        post: ""
    });

    useEffect(() => {
        // Запрос на получение списка должностей
        const fetchPostNames = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-post-names/');
                const filteredPostNames = response.data.post_names.filter(name => name !== "Project manager");
                setPostNames(filteredPostNames);
            } catch (error) {
            }
        };

        fetchPostNames();
    }, []);

    // Обработка изменения формы
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
    
        if (name === 'isPersonalData') {
            setIsPersonalData(val);
        } else {
            setFormData({
                ...formData,
                [name]: val
            });
        }
    };

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    // Отправка формы на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка обязательных полей
        if (!isPersonalData) {
            toast.error("Для регистрации необходимо дать согласие на обработку персональных данных");
            return;
        }

        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.post) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            // Запрос на регистрацию
            const response = await axios.post("http://127.0.0.1:8000/register/", formData);
        
            toast.success("Вы успешно зарегистрировались! Пожалуйста, пройдите авторизацию");
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch(error) {
                // Вывод ошибок с сервера
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
            {isOverlayVisible && <div className="overlay" onClick={closeModal} />}
            <form method="post" className="form">
                <X size={30} onClick={closeModal} className="close-log-reg"></X>
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
                    <option value="" disabled selected>Выберите должность</option>
                        {postNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div className="inputs-checkbox">
                    <input type="checkbox" name="isPersonalData" id="isPersonalData" checked={isPersonalData} onChange={handleChange} />
                    <label htmlFor="isPersonalData">
                        <Link to="/personal-data" target="blank" className="personal-data-link">Даю согласие на обработку персональных данных</Link>
                    </label><br />
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
