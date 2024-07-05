import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import '../styles/user-profile.css'
import user from '../assets/user.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'phosphor-react'

export const UserProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [photoData, setPhotoData] = useState(null);
    const [userPhoto, setUserPhoto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedPost, setSelectedPost] = useState('');
    const [postNames, setPostNames] = useState([]);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate('/');
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            // Запрос на получение профиля пользователя
            const response = await axios.get('http://127.0.0.1:8000/user-profile/', {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });

            setUserData(response.data);
            // Получение фотографии пользователя
            if (response.data.photo_data) {
                setUserPhoto(`data:image/png;base64, ${response.data.photo_data}`);
            } else {
                setUserPhoto(user);
            }
        } catch (error) {
        }
    };

    const fetchPostNames = async () => {
        try {
            // Запрос на получение списка должностей
            const response = await axios.get('http://127.0.0.1:8000/get-post-names/');
            // Невозможность выбрать должность "Project manager"
            const filteredPostNames = response.data.post_names.filter(name => name !== "Project manager");
                setPostNames(filteredPostNames);
        } catch (error) {
        }
    };

    const handlePhotoChange = (event) => {
        setPhotoData(event.target.files[0]);
    };

    const handleEditClick = () => {
        setShowModal(true);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setSelectedPost(userData.post);
        setIsOverlayVisible(true);
        fetchPostNames();
    };

    const handleModalClose = () => {
        setShowModal(false);
        setIsOverlayVisible(false);
    };

    // Отправка обновленного профиля на сервер
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            
            if (photoData) {
                formData.append('photo', photoData);
            }
            
            if (firstName !== userData.first_name) {
                formData.append('first_name', firstName);
            }
            
            if (lastName !== userData.last_name) {
                formData.append('last_name', lastName);
            }
            
            if (selectedPost !== userData.post) {
                formData.append('post', selectedPost);
            }
        
            // Запрос на редактирвоание профиля
            await axios.patch('http://127.0.0.1:8000/user-profile/update/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            toast.success("Изменения сохранены!");
            setTimeout(() => {
                fetchData();
                handleModalClose();
            }, 2000);
        } catch (error) {
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
        }}
    };

    return (
        <div className="user-profile">
            <Helmet>
                <title>Профиль пользователя</title>
            </Helmet>
            {userData && (
                <div className='user-profile'>
                    {isOverlayVisible && <div className="overlay" onClick={handleModalClose} />}
                    <h1>Личный профиль</h1>
                    <div className="user-container">
                        {userPhoto && <img src={userPhoto} alt={`Фото пользователя ${userData.first_name} ${userData.last_name}`} className='user-photo'/>}
                        <div className="user-info">
                            <h2>{userData.first_name} {userData.last_name}</h2><br />
                            <p>Email: <strong>{userData.email}</strong></p><br />
                            <p>Должность: <strong>{userData.post}</strong></p><br />
                            <p>Дата регистрации: <strong>{new Date(userData.date_joined).toLocaleString()}</strong></p>
                            <button className='user-btn' onClick={handleEditClick}>Редактировать</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="task-modal">
                    <div className="modal-content">
                        <X size={30} onClick={handleModalClose} className="close-log-reg"></X>
                        <div className="inputs">
                            <label htmlFor="first_name">Имя:</label><br />
                            <input type="text" name='first_name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label htmlFor="last_name">Фамилия:</label><br />
                            <input type="text" name='last_name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="inputs">
                        <label htmlFor="post">Должность:</label><br />
                        <select name="post" id="post" value={selectedPost} onChange={(e) => setSelectedPost(e.target.value)} required>
                            <option value="" disabled>Выберите должность</option>
                            {postNames.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                        </div>
                        <br /><br />
                        <label htmlFor="file-input" className="input-file-button">Выберите фото</label>
                        <input type="file" id="file-input" accept=".png, .jpg, .jpeg" onChange={handlePhotoChange} style={{ display: 'none' }} /> <br />
                        <button onClick={handleSaveChanges} className="btnSubmit">Сохранить изменения</button>
                    </div>
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

