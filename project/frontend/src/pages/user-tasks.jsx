import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/project-tasks.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import TaskModal from '../components/task-modal.jsx';
import TaskComments from '../components/task-comments.jsx';
import { StatusItem } from '../components/status-item.jsx';
import TaskCardUser from '../components/task-card-user.jsx';

function UserTasks() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [statusNames, setStatusNames] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedCommentTaskId, setSelectedCommentTaskId] = useState(null);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    
    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate('/');
        } else {
        const fetchTaskData = async () => {
            try {
                const [responseStatusNames, responseEmployees, responseUserTasks, responseProjects] = await Promise.all([
                    // Запрос на получение статусов задач
                    axios.get('http://127.0.0.1:8000/get-task-choices/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    // Запрос на получение списка сотрудников
                    axios.get('http://127.0.0.1:8000/get-employees/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    // Запрос на получение задач пользователя
                    axios.get('http://127.0.0.1:8000/user/tasks/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    // Запрос на получение списка проектов
                    axios.get('http://127.0.0.1:8000/projects/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    })
                ]);
                setStatusNames(responseStatusNames.data.status_names);
                setEmployees(responseEmployees.data);
                setUserTasks(responseUserTasks.data);
                setProjects(responseProjects.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTaskData();
    }}, []);

    // Настройка изменения статуса задачи при перетаскивании
    const handleTaskMove = async (taskId, newStatus) => {
        const updatedUserTasks = userTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        setUserTasks(updatedUserTasks);

        try {
            // Запрос изменения статуса задачи
            await axios.patch(`http://127.0.0.1:8000/task/${taskId}/update/`, { status: newStatus }, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
        } catch (error) {
        }
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Получение имени и фамилии сотрудников
    const getEmployeeName = (executorId) => {
        const executor = employees.find(employee => employee.id === executorId);
        if (executor) {
            return `${executor.first_name} ${executor.last_name}`;
        }
        return 'Неизвестный сотрудник';
    };

    // Получение название проекта
    const getProjectName = (projectId) => {
        const project = projects.find(project => project.id === projectId);
        return project ? project.name : 'Неизвестный проект';
    };

    const getTaskById = async (taskId) => {
        try {
            // Запрос на получение задачи по ID
            const response = await axios.get(`http://127.0.0.1:8000/task/${taskId}/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            setSelectedTask({ ...response.data, task_id: taskId });
        } catch (error) {
            console.error('Error fetching task data:', error);
        }
    };

    const handleTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
        getTaskById(taskId);
    };

    const handleCommentClick = (taskId) => {
        setSelectedCommentTaskId(taskId);
        setShowCommentsModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTaskId(null);
        setSelectedTask(null);
        setSelectedCommentTaskId(null);
        setShowCommentsModal(false);
    };

    return (
        <div className='project-tasks'>
            <Helmet>
                <title>Ваши задачи</title>
            </Helmet>

            <h1 style={{marginBottom: '50px'}}>ВАШИ ЗАДАЧИ</h1>

            <div className='status-card-all'>
                {statusNames.map(status => (
                    <StatusItem key={status} status={status}>
                        {userTasks.filter(task => task.status === status).map(task => (
                           <TaskCardUser
                           key={task.id}
                           task={task}
                           onTaskMove={handleTaskMove}
                           handleCommentClick={handleCommentClick}
                           handleTaskClick={handleTaskClick}
                           formatDate={formatDate}
                           getProjectName={getProjectName}
                           />
                        ))}
                    </StatusItem>
                ))}
            </div>
            {showCommentsModal && selectedCommentTaskId && (
                <TaskComments
                    taskId={selectedCommentTaskId}
                    taskName={userTasks.find(task => task.id === selectedCommentTaskId)?.name}
                    onClose={handleCloseModal}
                    employees={employees}
                />
            )}

            {selectedTaskId && (
                <TaskModal
                    task={selectedTask}
                    formatDate={formatDate}
                    getEmployeeName={getEmployeeName}
                    onClose={handleCloseModal}
                    showEditButton={false}
                />
            )}
        </div>
    );
}

export default UserTasks;
