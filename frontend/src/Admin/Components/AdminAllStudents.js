import {Card, Spin, message} from "antd";
import {useEffect, useState} from "react";

export default function AdminAllStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllStudents();
    }, []);

    const fetchAllStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8071/api/admin/all-students', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                message.error('Failed to fetch students');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
        setLoading(false);
    }

    return (
        <div className="container mt-5">
            <h1>All Students in System</h1>
            <Spin spinning={loading}>
                <div className="row mt-4">
                    {students.map(student => (
                        <div key={student._id} className="col-md-4 mb-4">
                            <Card title={student.name} style={{width: '100%'}}>
                                <p>Email: {student.email}</p>
                                <p>Phone: {student.phone}</p>
                                <p>Address: {student.address}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </Spin>
        </div>
    );
}