import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TaskCreate from '../components/task-create.jsx';
import '../styles/project-tasks.css';
import { Helmet } from 'react-helmet';
import TaskModal from '../components/task-modal.jsx';
import TaskComments from '../components/task-comments.jsx';
import EmployeesList from '../components/employees-list.jsx';
import { ToastContainer, toast } from 'react-toastify';
import TaskCard from '../components/task-card.jsx';
import { StatusItem } from '../components/status-item.jsx';
import Graphs from '../components/graphs.jsx';
import Documents from '../components/documents.jsx';
import DeletedTasks from '../components/deleted-tasks.jsx';

function ProjectTasks() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [statusNames, setStatusNames] = useState([]);
    const [showTaskCreate, setShowTaskCreate] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedCommentTaskId, setSelectedCommentTaskId] = useState(null);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showEmployeesList, setShowEmployeesList] = useState(false);
    const [showGraphs, setShowGraphs] = useState(false);
    const [showDocumnets, setShowDocuments] = useState(false);
    const [showDeletedTasks, setShowDeletedTasks] = useState(false);

    useEffect(() => {
        const fetchTaskChoices = async () => {
            try {
                // Запрос на получение нгазваний статусов задач
                const response = await axios.get('http://127.0.0.1:8000/get-task-choices/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setStatusNames(response.data.status_names);
            } catch (error) {
            }
        };

        fetchTaskChoices();
    }, []);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const [responseProject, responseEmployees] = await Promise.all([
                    // Запрос на получение выбранного проекта
                    axios.get(`http://127.0.0.1:8000/project/${projectId}`, {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    }),
                    // Запрос на списка сотрудников
                    axios.get('http://127.0.0.1:8000/get-employees/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    })
                ]);
                setProject(responseProject.data);
                setEmployees(responseEmployees.data);
            } catch (error) {
            }
        };

        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    const handleExportToXLSX = async () => {
        try {
            // Запрос на экспорт в Excel
            const response = await axios.get(`http://127.0.0.1:8000/project/${projectId}/export/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                },
                responseType: 'blob'
            });
    
            // Настройки экспорта
            const projectTitle = project.name.replaceAll(' ', '_');
            const fileName = `${projectTitle}_export.xlsx`; 

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
    
            link.setAttribute('download', fileName);
    
            document.body.appendChild(link);
            link.click();
    
            link.parentNode.removeChild(link);

            toast.success("Файл загружен!");
        } catch (error) {
        }
    };

    // Изменение статуса задачи при перетаскивании
    const handleTaskMove = async (taskId, newStatus) => {
        const updatedTasks = project.tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        
        setProject({
            ...project,
            tasks: updatedTasks
        });

        try {
            // Запрос на изменение статуса задачи
            await axios.patch(`http://127.0.0.1:8000/task/${taskId}/update/`, { status: newStatus }, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
        } catch (error) {
        }
    };

    // Настройка загрузки страницы
    if (!project || statusNames.length === 0) {
        return <div style={{color: 'var(--white-color)', marginTop: '400px'}}>Загрузка...</div>;
    }

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Получение имени и фамилии сотрудника
    const getEmployeeName = (executorId) => {
        const executor = employees.find(employee => employee.id === executorId);
        if (executor) {
            return `${executor.first_name} ${executor.last_name}`;
        }
        return 'Неизвестный сотрудник';
    };

    const getTaskById = async (taskId) => {
        try {
            // Запрос на получение задачи по ID
            const response = await axios.get(`http://127.0.0.1:8000/task/${taskId}/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            setSelectedTask({...response.data, task_id: taskId});
        } catch (error) {

        }
    };

    // Функция передачи данных для отображения выбранной задачи
    const handleTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
        getTaskById(taskId);
    };

    // Функция передачи данных для отображения комментариев выбранной задачи
    const handleCommentClick = (taskId) => {
        setSelectedCommentTaskId(taskId);
        setShowCommentsModal(true);
    };

    // Функция открытия модального окна списка сотрудников проекта
    const handleShowEmployeesModal = () => {
        setShowEmployeesList(true);
    };

    // Функция открытия модального окна статистики проекта
    const handleShowGraphs = () => {
        setShowGraphs(true);
    };

    // Функция открытия модального окна докуметов проекта
    const handleShowDocuments = () => {
        setShowDocuments(true);
    };

    // Функция открытия модального окна улалённых задач
    const handleShowDeletedTasks = () => {
        setShowDeletedTasks(true)
    };

    // Функция закрытия модальных окон
    const handleCloseModal = () => {
        setSelectedTaskId(null);
        setSelectedTask(null);
        setShowTaskCreate(null);
        setSelectedCommentTaskId(null);
        setShowCommentsModal(false);
        setShowEmployeesList(false);
        setShowGraphs(false);
        setShowDocuments(false);
        setShowDeletedTasks(false)
    };

    return (
        <div className='project-tasks'>
            <Helmet>
                <title>Задачи проекта "{project.name}"</title>
            </Helmet>
            <h1>Задачи проекта "{project.name}"</h1>
            <div className="task-btns">
                <button className='task-btn' onClick={handleShowEmployeesModal}>Список сотрудников</button>
                <button className='task-btn' onClick={handleExportToXLSX}>Экспорт в XLSX</button>
                <button className='task-btn' onClick={handleShowDeletedTasks}>Удалённые задачи</button>
                <button className='task-btn' onClick={handleShowGraphs}>Статистика</button>
                <button className='task-btn' onClick={handleShowDocuments}>Документы</button>
                <button className='task-btn' onClick={() => setShowTaskCreate(true)}>Создать задачу</button>
            </div>
            {showTaskCreate && (
                <TaskCreate 
                    onClose={handleCloseModal}
                />
            )}

            <div className='status-card-all'>
                {statusNames.map(status => (
                    <StatusItem key={status} status={status}>
                        {project.tasks.filter(task => task.status === status).map(task => (
                           <TaskCard
                           key={task.id}
                           task={task}
                           onTaskMove={handleTaskMove}
                           getEmployeeName={getEmployeeName}
                           handleCommentClick={handleCommentClick}
                           handleTaskClick={handleTaskClick}
                           formatDate={formatDate}
                           />
                        ))}
                    </StatusItem>
                ))}
            </div>

            {showCommentsModal && selectedCommentTaskId && (
                <TaskComments
                    taskId={selectedCommentTaskId}
                    taskName={project.tasks.find(task => task.id === selectedCommentTaskId)?.name}
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
                    showEditButton={true}
                    modalSize="large"
                />
            )}

            {showEmployeesList && (
                <EmployeesList
                    projectId={projectId}
                    onClose={handleCloseModal}
                />
            )}

            {showGraphs && (
                <Graphs
                    projectId={projectId}
                    onClose={handleCloseModal}
                />
            )}

            {showDocumnets && (
                <Documents
                    projectId={projectId}
                    onClose={handleCloseModal}
                />
            )}

            {showDeletedTasks &&  (
                <DeletedTasks
                    projectId={projectId}
                    onClose={handleCloseModal}
                    getEmployeeName={getEmployeeName}
                    formatDate={formatDate}
                />
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
}

export default ProjectTasks;