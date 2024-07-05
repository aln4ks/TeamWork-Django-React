import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ru';
import '../styles/event-calendar.css';
import { X } from 'phosphor-react';
import { FaRegTrashAlt , FaPencilAlt } from "react-icons/fa";

moment.locale('ru');

const localizer = momentLocalizer(moment);

// Перевод календаря на русский язык
const messages = {
    allDay: 'Весь день',
    previous: 'Назад',
    next: 'Вперед',
    today: 'Сегодня',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    agenda: 'События дня',
    date: 'Дата',
    time: 'Время',
    event: 'Событие',
    noEventsInRange: 'В этом диапазоне нет событий',
};

const EventCalendar = () => {
    const [showModal, setShowModal] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        time_begin: '',
        time_end: ''
    });
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const openModal = () => {
        setShowModal(true);
        setShowOverlay(true);
    }
    const closeModal = () => {
        setShowModal(false);
        setShowOverlay(false);
        setSelectedEvent(null);
    }
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const reloadPage = () => {
        window.location.reload();
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setNewEvent({
            id: event.id,
            name: event.title,
            time_begin: event.start,
            time_end: event.end
        });
        openModal();
    };

    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            navigate('/');
        } else {
            const getEvents = async () => {
                try {
                    // Запрос на получение списка событий
                    const response = await fetch('http://127.0.0.1:8000/event-scheduler/', {
                        headers: {
                            'token': sessionStorage.getItem("accessToken"),
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch events');
                    }
                    const data = await response.json();
                    setEvents(data);
                } catch (error) {
                }
            };

            getEvents();
        }
    }, []);

    const handleUpdateEvent = async () => {
        try {
            // Запрос на обновление события
            const response = await axios.patch(`http://127.0.0.1:8000/event-scheduler/${newEvent.id}/update/`, newEvent, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });

            toast.success("Событие обновлено!");
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

    // Отправка нового события на сервера
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        // Обязательные поля
        if (!newEvent.name || !newEvent.time_begin || !newEvent.time_end) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        // Форматирование даты в стандарт ISO
        const formattedNewEvent = {
            ...newEvent,
            time_begin: new Date(newEvent.time_begin).toISOString(),
            time_end: new Date(newEvent.time_end).toISOString()
        };

        try {
            // Запрос на создание события
            const response = await axios.post(`http://127.0.0.1:8000/event-scheduler/create`, formattedNewEvent, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });

            toast.success("Событие создано!");
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

    const handleDeleteEvent = async (eventId) => {
        try {
            // Запрос на удаление события
            const response = await axios.delete(`http://127.0.0.1:8000/event-scheduler/${eventId}/delete/`, {
                headers: {
                    'token': sessionStorage.getItem("accessToken"),
                }
            });
            toast.success("Событие удалено!");
            setTimeout(() => {
                reloadPage();
            }, 2000);
        } catch (error) {
            toast.error("Ошибка при удалении события");
        }
    };

    // Вывод списка предстоящих событий
    const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.name,
        start: new Date(event.time_begin),
        end: new Date(event.time_end),
    }));

    const upcomingEvents = formattedEvents.filter(event => moment(event.start) > moment());

    return (
        <div>
            {showOverlay && <div className="overlay" onClick={closeModal}></div>}
            <h1 style={{ color: 'var(--blue-color)' }}>КАЛЕНДАРЬ СОБЫТИЙ</h1>
            <div className='event-calendar'>
                <div style={{ height: '840px', width: '1500px', marginTop: '30px' }}>
                    <Calendar
                        localizer={localizer}
                        events={formattedEvents}
                        startAccessor="start"
                        endAccessor="end"
                        messages={messages}
                        style={{ maxWidth: '90%', margin: 'auto' }}
                    />
                </div>
                <div className="event-calendar-list">
                    <button className='calendar-btn' onClick={openModal}>Создать событие</button>
                    {upcomingEvents.length > 0 && (
                        <div className="event-calendar-list-info">
                            <h3>Предстоящие события:</h3>
                            <ul>
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="event-item">
                                        <p style={{textAlign: 'center'}}><strong>{event.title}</strong></p>
                                        <p><strong>Дата начала:</strong> {moment(event.start).format('DD.MM.YYYY HH:mm')}</p>
                                        <p><strong>Дата окончания:</strong> {moment(event.end).format('DD.MM.YYYY HH:mm')}</p>
                                        <p><strong>Дата создания:</strong> {moment(event.createdAt).format('DD.MM.YYYY HH:mm')}</p>
                                        <div className="event-btns">
                                            <FaPencilAlt size={20} onClick={() => handleEditEvent(event)} className='event-edit'/>
                                            <FaRegTrashAlt size={20} onClick={() => handleDeleteEvent(event.id)} className='event-delete'/>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>
                {showModal && (
                    <div className="task-modal">
                        <div className="modal-content">
                            <X size={30} onClick={closeModal} className='close-task-window' />
                            <h2>{selectedEvent ? 'Редактировать событие' : 'Создать событие'}</h2>
                            <div className="inputs">
                                <label htmlFor="name">Название</label><br />
                                <input type="text" name="name" value={newEvent.name} onChange={handleChange} />
                            </div>
                            <div className="inputs">
                                <label htmlFor="time_begin">Дата начала</label><br />
                                <input type="datetime-local" name="time_begin" value={moment(newEvent.time_begin).format('YYYY-MM-DDTHH:mm')} onChange={handleChange} />
                            </div>
                            <div className="inputs">
                                <label htmlFor="time_end">Дата окончания</label><br />
                                <input type="datetime-local" name="time_end" value={moment(newEvent.time_end).format('YYYY-MM-DDTHH:mm')} onChange={handleChange} />
                            </div>
                            <button onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent} className='btnSubmit'>{selectedEvent ? 'Обновить' : 'Создать'}</button>
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
        </div>
    );
};

export default EventCalendar;