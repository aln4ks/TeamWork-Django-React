import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import '../styles/projects.css'
import { FaRegTrashAlt  } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
          if (!sessionStorage.getItem("accessToken")) {
            navigate('/');
          } else {
            try {
              // Запрос на получение списка проектов
                const responseProjects = await axios.get('http://127.0.0.1:8000/projects/', {
                    headers: {
                        'token': sessionStorage.getItem("accessToken"),
                    }
                });
                setProjects(responseProjects.data);
            } catch (error) {
            }
        }};

        const fetchEmployees = async () => {
            try {
              // Запрос на получение списка сотрудников
                const responseEmployees = await axios.get('http://127.0.0.1:8000/get-employees/', {
                headers: {
                  'token': sessionStorage.getItem("accessToken"),
                }
              });
                setEmployees(responseEmployees.data);
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

        fetchProjects();
        fetchEmployees();
        fetchUserProfile();
    }, []);

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Получение имени и фамилии сотрудника
    const getEmployeeName = (creatorId) => {
      const creator = employees.find(employee => employee.id === creatorId);
      if (creator) {
          return `${creator.first_name} ${creator.last_name}`;
      }
      return 'Unknown';
    };

    const openModal = (project) => {
      setSelectedProject(project);
      setShowModal(true);
      setShowOverlay(true);
  };
  
  const closeModal = () => {
      setShowModal(false);
      setShowOverlay(false);
  };
  
  const handleDeleteProject = async () => {
      try {
        // Запрос на удаление проекта
          await axios.delete(`http://127.0.0.1:8000/project/${selectedProject.id}/delete/`, {
              headers: {
                  'token': sessionStorage.getItem("accessToken"),
              }
          });
          
          setProjects(projects.filter(project => project.id !== selectedProject.id));
  
          toast.success("Вы удалили проект!");

          closeModal();
      } catch (error) {
      }
  };

    return (
        <div className='projects'>
            <Helmet>
                <title>Просмотр проектов</title>
            </Helmet>
            {showOverlay && <div className="overlay" onClick={closeModal}></div>}
            <h1>ПРОСМОТР ПРОЕКТОВ</h1>
            {projects.map(project => (
              <div key={project.id} className='project-card'>
                <Link key={project.id} to={`/project/${project.id}`} className='project-link'>
                  <div className="card-top">
                    <p>Создатель: {getEmployeeName(project.creator)}</p>
                    <p><strong>{project.name}</strong></p>
                    <p>Создан: {formatDate(project.created_at)}</p>
                  </div>
                  </Link>
                  <div className="description">
                    <p>{project.description}</p>
                  </div>
                  {userProfile && userProfile.id === project.creator && (
                    <FaRegTrashAlt size={32} onClick={() => openModal(project)} className='project-delete'> </FaRegTrashAlt>
                  )}
                  
              </div>
            ))}
        {showModal && selectedProject && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Вы действительно хотите удалить проект "{selectedProject.name}"?</h3>
                    <div className="modal-btns">
                      <button onClick={handleDeleteProject}>Да</button>
                      <button onClick={closeModal}>Нет</button>
                    </div>
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
}

export default Projects;
