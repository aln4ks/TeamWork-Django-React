import React from 'react';
import { useDrag } from 'react-dnd';
import { User } from 'phosphor-react';
import { BsExclamationCircle, BsCalendar2Check } from "react-icons/bs";
import { FaInfoCircle, FaCommentDots } from "react-icons/fa";

const TaskCard = ({ task, onTaskMove, formatDate, getEmployeeName, handleCommentClick, handleTaskClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASKCARD',
        item: { id: task.id },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                onTaskMove(item.id, dropResult.status);
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    });

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}key={task.id} className={task.priority === 'Важный' ? 'task-card high' : task.priority === 'Срочный' ? 'task-card highest' : 'task-card default'}>
            <h4>{task.name}</h4>
            <div className="task-info">
            <div className="parent-element">
                <BsCalendar2Check size={25} weight="bold" />
                <p>{formatDate(task.deadline)}</p>
            </div>
            <div className="parent-element">
                <BsExclamationCircle size={25} weight="bold" />
                <p>{task.priority}</p>
            </div>
            <div className="parent-element">
                <User size={25} weight="bold" />
                <p>{getEmployeeName(task.executor_id)}</p>
            </div>
            <div className="task-info-click">
                <FaCommentDots size={25} onClick={() => handleCommentClick(task.id)} />
                <FaInfoCircle size={25} onClick={() => handleTaskClick(task.id)} />
            </div>
            </div>
        </div>
    );
};

export default TaskCard;