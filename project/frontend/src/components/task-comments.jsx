import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/task-comments.css'
import { X } from 'phosphor-react';
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegTrashAlt  } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TaskComments({ taskId, taskName, onClose, employees }) {
    const [comments, setComments] = useState([]);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        // Запрос на отображение комментариев
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/task/${taskId}/comments`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setComments(response.data);
            } catch (error) {
            }
        };

        const fetchUserProfile = async () => {
            try {
                // Запрос на получение профиля пользователя
                const responseUserProfile = await axios.get('http://127.0.0.1:8000/user-profile/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setUserProfile(responseUserProfile.data);
            } catch (error) {
            }
        };

        fetchComments();
        fetchUserProfile();
    }, [taskId]);

    const handleSaveComment = async () => {
        try {
            // Запрос на создание комментария
            const response = await axios.post(`http://127.0.0.1:8000/task/${taskId}/comment/create`, {
                description: newComment,
                task: taskId
            }, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            toast.success("Комментарий создан!");
            setComments([...comments, response.data]);
            setNewComment('');
            setIsCreatingComment(false);
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

    const handleDeleteComment = async (commentId) => {
        try {
            // Запрос на удаление комментария
            await axios.delete(`http://127.0.0.1:8000/comment/${commentId}/delete`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            toast.success("Вы удалили комментарий!");
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {

        }
    };

    // Получение имени и фамилии автора комментария
    const getEmployeeName = (authorId) => {
        const author = employees.find(employee => employee.id === authorId);
        if (author) {
            return `${author.first_name} ${author.last_name}`;
        }
        return 'Неизвестный пользователь';
    };

    const handleNewComment = () => {
        setIsCreatingComment(true);
    };

    const handleCancelComment = () => {
        setNewComment('');
        setIsCreatingComment(false);
    };

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    return (
        <div>
            {isOverlayVisible && <div className="overlay" onClick={closeModal} />}
            <div className="task-modal" style={{width: '800px'}}>
                <h2 style={{color: 'var(--white-color)'}}>Комментарии к задаче "{taskName}"</h2>
                <X size={30} onClick={onClose} className='close-task-window' />
                {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <p><strong>{comment.description}</strong></p>
                        <div className="comment-info">
                            <p>Автор: {getEmployeeName(comment.author, employees)}</p>
                            <p>Дата создания: {new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                        {userProfile && userProfile.id === comment.author && (
                            <FaRegTrashAlt size={20} onClick={() => handleDeleteComment(comment.id)} className="delete-comment-btn" />
                        )}
                    </div>
                ))}

                {!isCreatingComment ? (
                    <FaCirclePlus size={30} className='new-comment-btn' onClick={handleNewComment} />
                ) : (
                    <div>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className='teaxtarea-comment'/>
                        <button onClick={handleSaveComment} className='btnSubmit'>Сохранить</button>
                        <button onClick={handleCancelComment} className='btnSubmit' style={{marginLeft: '20px'}}>Отмена</button>
                    </div>
                )}
            </div>
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

export default TaskComments;