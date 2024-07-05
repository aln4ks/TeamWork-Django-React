import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'phosphor-react';
import '../styles/documents.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegTrashAlt  } from "react-icons/fa";

function Documents({ projectId, onClose }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [documents, setDocuments] = useState([]);

    // Запрос на получение списка документов
    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/project/${projectId}/documents/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });

            const documentsArray = Object.keys(response.data).map(key => ({
                name: key,
                url: response.data[key]
            }));

            setDocuments(documentsArray);
        } catch (error) {
            console.error(error);
        }
    };

    // Обноление списка документов
    useEffect(() => {
        fetchDocuments();
    }, [projectId]);

    // Запрос на удаление документа
    const deleteDocument = async (fileName) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/project/${projectId}/documents/delete`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                },
                data: {
                    disk_file_path: fileName
                }
            });
    
            setDocuments(documents.filter(document => document.name !== fileName));
            toast.success('Документ успешно удален!');
        } catch (error) {
        }
    };

    // Запрос на загрузку документа
    const uploadDocument = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_name', file.name);
    
        try {
            await axios.put(`http://127.0.0.1:8000/project/${projectId}/documents/load`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
    
            fetchDocuments();
            toast.success('Документ успешно загружен!');
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

    const reloadPage = () => {
        window.location.reload();
    };

    return (
        <div>
            {isOverlayVisible && <div className="overlay" onClick={closeModal}/>}
            <div className="task-modal">
                <h2 style={{ color: 'var(--white-color)' }}>Документы проекта</h2>
                <X size={30} onClick={onClose} className='close-task-window' style={{ right: '20px' }} />
                {documents.length > 0 && (
                    <ul className="documents">
                        {documents.map((document, index) => (
                            <li key={index} className='documents-item'>
                                <a href={document.url} target="_blank" rel="noopener noreferrer">{document.name}</a>
                                <FaRegTrashAlt size={20} onClick={() => deleteDocument(document.name)} className='document-delete'/>
                            </li>
                        ))}
                    </ul>
                )}
                <br /><br />
                <label htmlFor="input-document" className="input-document">Добавить файл</label>
                <input type="file" name='input-document' id='input-document' onChange={(e) => uploadDocument(e.target.files[0])} style={{ display: 'none' }}/>
            </div>
        </div>
    );
}

export default Documents;