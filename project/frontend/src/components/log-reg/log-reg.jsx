import React, { useState } from "react";
import './log-reg.css'

export const LogReg = () => {

    const [action, setAction] = useState("Login")
    const handleActionChange = (newAction) => {
        setAction(newAction);
    };

    return (
    <div className="window">
        <div className="btns">
            <button className={action === 'Login'?'btn focused':'btn'} onClick={() => handleActionChange('Login')}>Авторизация</button>
            <button className={action === 'Register'?'btn focused':'btn'} onClick={() => handleActionChange('Register')}>Регистрация</button>
        </div>
        <div className="form">
            {action === 'Login' ? (
                <form action="">
                    <div className="inputs">
                        <label htmlFor="email">Email:</label><br />
                        <input type="email" name="email" id="email"/>
                    </div>
                    <div className="inputs">
                        <label htmlFor="password">Пароль:</label><br />
                        <input type="password" name="password" id="password"/>
                    </div>

                    <button type="submit" className="btnSubmit">Войти</button>
                </form>
            ) : (
                <form action="" method="post">
                    <div className="inputs">
                        <label htmlFor="first_name">Имя:</label><br />
                        <input type="text" name="first_name" id="first_name"/>
                    </div>
                    <div className="inputs">
                        <label htmlFor="last_name">Фамилия:</label><br />
                        <input type="text" name="last_name" id="last_name"/>
                    </div>
                    <div className="inputs">
                        <label htmlFor="email">Email:</label><br />
                        <input type="email" name="email" id="email"/>
                    </div>
                    <div className="inputs">
                        <label htmlFor="password">Пароль:</label><br />
                        <input type="password" name="password" id="password"/>
                    </div>
                    <div className="inputs">
                        <label htmlFor="reppassword">Повторите пароль:</label><br />
                        <input type="password" name="reppassword" id="reppassword"/>
                    </div>

                    <div className="inputs">
                        <label htmlFor="post">Должность:</label><br />
                        <select name="post" id="post"></select>
                    </div>

                    <button type="submit" className="btnSubmit">Зарегистрироваться</button>
                </form>
                )}
        </div>
    </div>
    );
};