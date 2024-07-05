import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { X } from 'phosphor-react';

function Graphs({ projectId, onClose }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [graphicImage, setGraphicImage] = useState(null);
    const [dayOfWeekGraphic, setDayOfWeekGraphic] = useState(null);

    // Запрос на получение графика выполненных задача
    useEffect(() => {
        const fetchCompletedTasksGraphic = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/project/${projectId}/completed-tasks-graphic/`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });

                setGraphicImage(response.data.image);
            } catch (error) {
                console.error(error);
            }
        };

        // Запрос на получение графика выполненных задач по дням недели
        const fetchDayOfWeekGraphic = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/project/${projectId}/completed-tasks-by-day-of-week-graphic/`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });

                setDayOfWeekGraphic(response.data.image);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCompletedTasksGraphic();
        fetchDayOfWeekGraphic();
    }, [projectId]);

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    return (
        <div>
        {isOverlayVisible && <div className="overlay" onClick={closeModal}/>}
        <div className="task-modal">
        <h2 style={{color: 'var(--white-color)'}}>Статистика проекта</h2>
        <X size={30} onClick={onClose} className='close-task-window' style={{right: '20px'}}/>
        <div className="graphs" style={{display: 'flex'}}>
        {dayOfWeekGraphic && <img src={`data:image/png;base64, ${dayOfWeekGraphic}`} alt="График по дням недели" />}
        {graphicImage && <img src={`data:image/png;base64, ${graphicImage}`} alt="График по задачам" />}
        </div>
        </div>
        </div>
    );
}


export default Graphs