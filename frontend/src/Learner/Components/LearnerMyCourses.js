import React, { useState, useEffect } from 'react';
import { Card, Spin, message, Modal, Checkbox } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";

export default function LearnerMyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [checkedContentId, setCheckedContentId] = useState(null);
    const learnerId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8070/api/learner/enrollments/${learnerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const enrollments = await response.json();
                const courseIds = enrollments.map(enrollment => enrollment.course);
                await fetchCourses(courseIds);
            } else {
                message.error('Failed to fetch enrolled courses');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    const fetchCourses = async (courseIds) => {
        try {
            const response = await fetch('http://localhost:8070/api/learner/all-courses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const enrolledCourses = data.filter(course => courseIds.includes(course._id));
                setCourses(enrolledCourses);
            } else {
                message.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
    };

    const handleUnenroll = async () => {
        try {
            const response = await fetch('http://localhost:8070/api/learner/enrollments', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ courseId: selectedCourse._id })
            });

            if (response.ok) {
                message.success('Unenrolled successfully');
                closeModal();
                fetchEnrolledCourses();
            } else {
                message.error('Failed to unenroll');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
    };

    const handleCardClick = (course) => {
        setSelectedCourse(course);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedCourse(null);
    };

    const handleContentCheck = async (e, contentId) => {
        const completed = e.target.checked;
        setCheckedContentId(completed ? contentId : null);
        try {
            const response = await fetch('http://localhost:8070/api/learner/enrollments/progress', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ contentId, completed })
            });

            if (response.ok) {
                message.success('Progress updated successfully');
            } else {
                message.error('Failed to update progress');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
    };

    const isChecked = (contentId) => {
        if (!selectedCourse || !selectedCourse.progress) return false;
        const progressItem = selectedCourse.progress.find(item => item.content_id === contentId);
        return progressItem ? progressItem.completed : false;
    };

    return (
        <div className="container mt-5">
            <h1>Learner My Courses</h1>
            <Spin spinning={loading}>
                <div className="row mt-4">
                    {courses.map(course => (
                        <div key={course._id} className="col-md-4 mb-4">
                            <Card title={course.title} style={{ width: '100%' }} onClick={() => handleCardClick(course)}>
                                <p>{course.description}</p>
                                <p>{course.requirements}</p>
                                <p>Price: ${course.price}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </Spin>
            <Modal
                title={selectedCourse ? selectedCourse.title : ''}
                visible={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="80%"
            >
                {selectedCourse && (
                    <div>
                        <p>Description: {selectedCourse.description}</p>
                        <p>Requirements: {selectedCourse.requirements}</p>
                        <p>Price: ${selectedCourse.price}</p>
                        <h2>Course Content</h2>
                        {selectedCourse.content.map((contentItem, index) => (
                            <div key={index}>
                                <p><strong>Title:</strong> {contentItem.title}</p>
                                {contentItem.doc_type === 'video' && contentItem.url && (
                                    <ReactPlayer url={contentItem.url} controls width="100%" />
                                )}
                                {contentItem.doc_type !== 'video' && (
                                    <p><strong>File:</strong> <a href={contentItem.url}>{contentItem.url}</a></p>
                                )}
                                <Checkbox
                                    onChange={(e) => handleContentCheck(e, contentItem._id)}
                                    checked={checkedContentId === contentItem._id}
                                >
                                    Completed
                                </Checkbox>
                                <hr />
                            </div>
                        ))}
                        <Button type="danger" className="btn btn-danger" onClick={handleUnenroll}>Unenroll</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

