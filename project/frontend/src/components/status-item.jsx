import { useDrop } from 'react-dnd';

// Создание области для перетаскивания задач
export const StatusItem = ({ status, children }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TASKCARD',
        drop: (item, monitor) => {
            return { status };
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div className='status-card' ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'white' }}>
        <div className='status-name'>{status}</div>
            {children}
        </div>
    );
};