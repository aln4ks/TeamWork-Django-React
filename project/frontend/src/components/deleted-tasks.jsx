import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { X } from 'phosphor-react';
import '../styles/deleted-tasks.css'
import { User } from 'phosphor-react';
import { BsExclamationCircle, BsCalendar2X } from "react-icons/bs";
import { TbStatusChange, TbRestore } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeletedTasks({ projectId, onClose, formatDate, getEmployeeName,  }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [tasks, setTasks] = useState([]);
    const reloadPage = () => {
        window.location.reload();
    };

    // Запрос на получение удаленных задач
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/${projectId}/tasks/deleted/`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });         
                setTasks(response.data);
            } catch (error) {
            }
        };

        fetchTasks();
    }, [projectId]);

    // Запрос на полное удаление задачи
    const handleDeleteTask = async (taskId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/task/${taskId}/hard-delete/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });

            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
    
            toast.success('Задача удалена навсегда!');
        } catch (error) {
        }
    };

    // Запрос на восстановление задачи
    const handleRestoreTask = async (taskId) => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/${taskId}/task/restore/`, "", {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
    
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
    
            toast.success('Задача восстановлена!');
            setTimeout(() => {
                reloadPage();
            }, 2000);
        } catch (error) {
        }
    };

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };
    

    return (
        <div>
        {isOverlayVisible && <div className="overlay" onClick={closeModal}/>}
        <div className="task-modal">
        <X size={30} onClick={onClose} className='close-task-window' />
        <h2 style={{color: 'var(--white-color)'}}>Удалённые задачи</h2>
        <div className="deleted-tasks">
        {tasks.map(task => (
                    <div key={task.id} className={task.priority === 'Важный' ? 'deleted-task-item high' : task.priority === 'Срочный' ? 'deleted-task-item highest' : 'deleted-task-item default'}>
                        <h3>{task.name}</h3>
                        <div className="parent-element">
                            <TbStatusChange size={25} weight="bold" />
                            <p>{task.status}</p>
                        </div>
                        <div className="parent-element">
                            <BsExclamationCircle size={25} weight="bold" />
                            <p>{task.priority}</p>
                        </div>
                        <div className="parent-element">
                            <User size={25} weight="bold" />
                            <p>{getEmployeeName(task.executor)}</p>
                        </div>
                        <div className="parent-element">
                            <BsCalendar2X size={25} weight="bold" />
                            <p>{formatDate(task.deleted_at)}</p>
                        </div>
                        <div className="deleted-task-btns">
                            <TbRestore size={25} weight="bold" onClick={() => handleRestoreTask(task.id)}/>
                            <FaRegTrashAlt size={25} weight="bold" onClick={() => handleDeleteTask(task.id)}/>
                        </div>
                    </div>
                ))}
        </div>
        </div>
        </div>
    );
}


export default DeletedTasks