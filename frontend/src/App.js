import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Main/Login";
import InstructorHome from "./Instructor/Pages/InstructorHome";
import LearnerHome from "./Learner/Pages/LearnerHome";
import AdminHome from "./Admin/Pages/AdminHome";
import Signup from "./Main/Signup";
import Home from "./Main/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/instructor/home" element={<InstructorHome />} />

                <Route path="/learner/home" element={<LearnerHome />} />

                <Route path="/admin/home" element={<AdminHome />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
