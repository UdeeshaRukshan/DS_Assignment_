import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import LearnerSignup from "../Learner/Pages/LearnerSignup";
import AdminSignup from "../Admin/Pages/AdminSignup";
import InstructorSignup from "../Instructor/Components/InstructorSignup";

export default function Signup () {
    const [activeTab, setActiveTab] = useState('learner');

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <>
            <div className="row">
                <div className="col text-center">
                    <Tabs activeKey={activeTab} onSelect={handleTabChange} className="justify-content-center"
                          style={{borderBottom: 'none', boxShadow: 'none'}}>
                        <Tab eventKey="learner" title="Learner">
                            <LearnerSignup/>
                        </Tab>
                        <Tab eventKey="instructor" title="Instructor">
                            <InstructorSignup/>
                        </Tab>
                        <Tab eventKey="admin" title="Admin">
                            <AdminSignup/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
}