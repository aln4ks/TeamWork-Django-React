import React from "react";
import { LogReg } from "../../components/log-reg/log-reg";
import logoMain from "../../assets/logoMain.svg"
import { UsersThree } from 'phosphor-react';
import './main.css'
import { Link } from "react-router-dom";

export const Main = () => {
    return <div className="main">
        <div className="logo">
            <img src={logoMain} alt="" />
            <p>collaborate, innovate, succeed</p>
        </div>

        <div className="team">
            <UsersThree size={500} />
        </div>

        <LogReg />

        <div className="links">
            <Link className="link">о нас</Link>
            <Link className="link">контакты</Link>
        </div>
    </div>
}