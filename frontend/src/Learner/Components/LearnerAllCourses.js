import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const LearnerAllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const learnerId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const fetchAllCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8073/api/learner/all-courses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Filter courses with status 'accepted'
                const acceptedCourses = data.filter(course => course.status === 'accepted');
                setCourses(acceptedCourses);
            } else {
                message.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    const handleEnroll = async (courseId) => {
        try {
            const response = await fetch('http://localhost:8073/api/learner/enroll-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ learnerId, courseId })
            });

            if (response.ok) {
                message.success('Course enrolled successfully');
            } else {
                message.error('Failed to enroll in the course');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Learner All Courses</h1>
            <Spin spinning={loading}>
                <div className="row mt-4">
                    {courses.map(course => (
                        <div key={course._id} className="col-md-4 mb-4">
                            <Card title={course.title} style={{ width: '100%' }}>
                                <p>{course.description}</p>
                                <p>{course.requirements}</p>
                                <p>Price: ${course.price}</p>
                                <Button type="primary" onClick={() => handleEnroll(course._id)}>Enroll</Button>
                            </Card>
                        </div>
                    ))}
                </div>
            </Spin>
        </div>
    );
};

export default LearnerAllCourses;
