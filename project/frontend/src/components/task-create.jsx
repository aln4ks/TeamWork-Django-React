import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/task-create.css'
import { X } from 'phosphor-react'

const TaskCreate = ({onClose})=> {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        deadline: "",
        priority: "",
        category: "",
        executor: "",
        status: "",
        project_id: projectId,
    });

    const [priorities, setPriorities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [executors, setExecutors] = useState([]);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);

    useEffect(() => {
        const fetchTaskChoices = async () => {
            if (!sessionStorage.getItem("accessToken")) {
                navigate('/login');
            } else {
                try {
                    // Запрос получение приоритетов и статусов задач
                    const response = await axios.get('http://127.0.0.1:8000/get-task-choices/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    });
                    setPriorities(response.data.priority_names);
                    setCategories(response.data.category_names);
                } catch (error) {
                    console.error('Ошибка загрузки вариантов задач:', error);
                }
            }
        };

        fetchTaskChoices();
    }, []);

    useEffect(() => {
        const fetchExecutors = async () => {
            try {
                // Запрос на получение сотрудников проекта
                const response = await axios.get(`http://127.0.0.1:8000/get-employees/${projectId}`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setExecutors(response.data);
            } catch (error) {
                console.error('Ошибка загрузки исполнителей:', error);
            }
        };

        fetchExecutors();
    }, []);

    // Изменение формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const reloadPage = () => {
        window.location.reload();
    };

    // Отправка формы на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Обязатльные поля
        if (!formData.name || !formData.description|| !formData.deadline|| !formData.priority || !formData.category || !formData.executor) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }


        try {
            // Запрос на создание задачи
            const response = await axios.post(`http://127.0.0.1:8000/project/${formData.project_id}/task/create/`, formData, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            
            toast.success("Задача успешно создана");
            setTimeout(() => {
                reloadPage();
            }, 2000);
            
        } catch (error) {
            // Вывод ошибок с сервера
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach(field => {
                    const errorMessage = error.response.data[field];
                    if (errorMessage && errorMessage.length > 0) {
                        errorMessage.forEach(msg => {
                            toast.error(msg);
                        });
                    }
                });
            }
        }
    };
    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    return (
        <div>
        {isOverlayVisible && <div className="overlay" onClick={closeModal} />}
            <form onSubmit={handleSubmit} className="form-task">
            <div className="form-container">
            <X size={30} onClick={onClose} className='close-task-window'/> 
                <div className="left">
                    <div className="inputs">
                        <label>Название:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="inputs">
                        <label>Описание:</label>
                        <textarea name="description" id='description-task' value={formData.description} onChange={handleChange} required />
                    </div>
                    </div>
                <div className="right">
                    <div className="inputs">
                        <label>Дедлайн:</label>
                        <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} required />
                    </div>
                    <div className="inputs">
                        <label>Приоритет:</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} required>
                        <option value="" disabled selected>Выберите приоритет</option>
                            {priorities.map((priority, index) => (
                                <option key={index} value={priority}>{priority}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inputs">
                        <label>Категория:</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="" disabled selected>Выберите категорию</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inputs">
                        <label>Исполнитель:</label>
                        <select name="executor" value={formData.executor} onChange={handleChange} required>
                        <option value="" disabled selected>Выберите исполнителя</option>
                            {executors.map(executor => (
                                <option key={executor.id} value={executor.id}>{`${executor.first_name} ${executor.last_name}`}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
                <button type="submit" className='btnSubmit'>Создать задачу</button>
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
    )}

export default TaskCreate;