import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { Main } from './pages/main';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { UserProfile } from './pages/user-profile';
import Projects from './pages/projects';
import ProjectTasks from './pages/projectTasks';
import ProjectCreate from './pages/project-create';
import SideBar from './components/sideBar';
import UserTasks from './pages/user-tasks';
import EventCalendar from './pages/event-calendar';
import { PersonalData } from './pages/resonal-data';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <SideBar />
        <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/personal-data' element={<PersonalData />} />
            <Route path='/user-profile' element={<UserProfile />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/project-create' element={<ProjectCreate />} />
            <Route path='/user-tasks' element={<UserTasks />} />
            <Route path='/event-calendar' element={<EventCalendar />} />
            <Route path="/project/:projectId" element={<ProjectTasks />} />
          </Routes>
        </DndProvider>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
