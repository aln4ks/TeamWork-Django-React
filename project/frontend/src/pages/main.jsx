import React, { useEffect, useState } from "react";
import logoMain from "../assets/logoMain.svg"
import { RiTeamLine } from "react-icons/ri";
import '../styles/main.css'
import { Helmet } from "react-helmet";
import Login from "../components/login";
import Register from "../components/register";
import { useNavigate } from "react-router-dom";

export const Main = () => {
    const navigate = useNavigate()
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    useEffect(() => {
        if (sessionStorage.getItem("accessToken")) {
            navigate('/user-profile');
        } else {
        document.body.classList.add('main');
    
        return () => {
          document.body.classList.remove('main');
        };
      }}, []);

    const handleCloseModal = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    return <div className="main">
        <Helmet>
            <title>Главная</title>
        </Helmet>

        <div className="logomain">
            <img src={logoMain} alt="" />
            <p>collaborate, innovate, succeed</p>
        </div>

        <div className="info">
        <div className="info1">
            <div className="info1-1">
            <p>Помогаем повысить продуктивность командной работы, улучшить взаимодействие между сотрудниками и эффективно управлять задачами и проектами.</p>
            </div>
            <button className="main-btn" onClick={() => setShowRegister(true)}>Регистрация</button>
        </div>

        <div className="info2">
            <div className="info1-1">
            <p>TeamWork - это онлайн платформа для эффективной командной работы сотрудников. На сайте менеджеры могут создавать проекты и распределять задачи среди членов команды. Каждый сотрудник может отслеживать свои задачи, их статусы, приоритеты и дедлайны, обеспечивая прозрачность и организованность в рабочем процессе.</p>
            </div>
            <button className="main-btn" onClick={() => setShowLogin(true)}>Авторизация</button>
        </div>
        </div>

        <div className="team">
            <RiTeamLine size={900} />
        </div>

        {showLogin && (
            <Login 
                onClose={handleCloseModal}
            />
        )}

        {showRegister && (
            <Register
                onClose={handleCloseModal}
            />
        )}
    </div>
}
