import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import InstructorLoginPage from "../Instructor/Pages/InstructorLoginPage";
import LearnerLogin from "../Learner/Pages/LearnerLogin";
import AdminLogin from "../Admin/Pages/AdminLogin";

export default function Login() {
    const [activeTab, setActiveTab] = useState('learner');

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <>
            <div className="row">
                <div className="col text-center">
                    <Tabs activeKey={activeTab} onSelect={handleTabChange} className="justify-content-center" style={{ borderBottom: 'none', boxShadow: 'none' }}>
                        <Tab eventKey="learner" title="Learner">
                            <LearnerLogin />
                        </Tab>
                        <Tab eventKey="instructor" title="Instructor">
                            <InstructorLoginPage />
                        </Tab>
                        <Tab eventKey="admin" title="Admin">
                            <AdminLogin />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
