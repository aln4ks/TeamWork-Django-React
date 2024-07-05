import React from "react";
import { FaRegUser, FaRegCalendarAlt } from "react-icons/fa";
import { PiProjectorScreenBold, PiNotePencilBold } from "react-icons/pi";
import { BiTask } from "react-icons/bi";

export const SiderbarData = [
    {
        title: 'Профиль',
        path: '/user-profile',
        icon: <FaRegUser size={25}/>,
        cName: 'nav-text'
    },
    {
        title: 'Просмотр проектов',
        path: '/projects',
        icon: <PiProjectorScreenBold size={25}/>,
        cName: 'nav-text'
    },
    {
        title: 'Создать проект',
        path: '/project-create',
        icon: <PiNotePencilBold size={25}/>,
        cName: 'nav-text'
    },
    {
        title: 'Мои задачи',
        path: '/user-tasks',
        icon: <BiTask size={25}/>,
        cName: 'nav-text'
    },
    {
        title: 'Календарь событий',
        path: '/event-calendar',
        icon: <FaRegCalendarAlt size={25}/>,
        cName: 'nav-text'
    },
]