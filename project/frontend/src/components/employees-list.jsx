import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { X } from 'phosphor-react';

function EmployeesList({ projectId, onClose }) {
    const [employeesData, setEmployeesData] = useState([]);
    const [postNames, setPostNames] = useState([]);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);

    // Запрос на получение названий должностей
    useEffect(() => {
        const fetchPostNames = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-post-names/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setPostNames(response.data.post_names);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPostNames();
    }, []);

    // Запрос на получение сотрудников проекта
    useEffect(() => {
        const fetchEmployeesData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/get-employees/${projectId}/`, {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setEmployeesData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmployeesData();
    }, [projectId]);

    // Фильтрация сотрудников по должности
    const renderEmployeesByPost = (post) => {
        return employeesData.filter(employee => employee.post === post).map(employee => (
            <div key={employee.id} style={{marginLeft: '20px', color: 'var(--white-color)'}}>
                {employee.first_name} {employee.last_name}
            </div>
        ));
    };

    const closeModal = () => {
        setIsOverlayVisible(false);
        onClose();
    };

    return (
        <div>
        {isOverlayVisible && <div className="overlay" onClick={closeModal}/>}
        <div className="task-modal" style={{width: '350px', paddingBottom: '20px'}}>
            <h2 style={{color: 'var(--white-color)'}}>Список сотрудников проекта</h2>
            <X size={30} onClick={onClose} className='close-task-window' style={{right: '20px'}}/>
            {postNames.map(post => (
                employeesData.some(employee => employee.post === post) && (
                    <div key={post} style={{textAlign: 'left', marginBottom: '10px'}}>
                        <h3 style={{color: 'var(--white-color)'}}>{post}:</h3>
                        {renderEmployeesByPost(post)}
                    </div>
                )
            ))}
        </div>
        </div>
    );
}


export default EmployeesList