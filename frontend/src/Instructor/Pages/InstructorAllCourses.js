import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Modal, Button, Form, Input, Upload, message, Radio, Progress } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import ReactPlayer from 'react-player';
import './InstructorAllCourses.css'

const GetAllCoursesByInstructorId = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [course, setCourse] = useState(null);
    const [form] = Form.useForm();
    const [fileUpload, setFileUpload] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [enrolldata, setEnrolldata] = useState([]);
    const [progesslernerID, setprogesslernerID] = useState(null);
    const [progressCount, setProgressCount] = useState(0);
    const [totalContentCount, setTotalContentCount] = useState(0);

    const uploadFile = async () => {
        if (!fileUpload) return Promise.reject("No file to upload");
        const fileRef = ref(storage, `/${fileUpload.name + v4()}`);
        const snapshot = await uploadBytes(fileRef, fileUpload);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    };

    useEffect(() => {
        console.log("File URL: ", fileUrl);
    }, [fileUrl]);

    useEffect(() => {
        const instructorId = localStorage.getItem('instructorId');

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:8072/api/instructor/${instructorId}/courses`);
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Failed to fetch courses');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const filtered = courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(filtered);
    }, [searchTerm, courses]);

    const handleViewDetails = async (courseId) => {
        setSelectedCourseId(courseId);
        setModalVisible(true);
        try {
            const response = await axios.get(`http://localhost:8072/api/instructor/course/${courseId}`);
            setCourse(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch course details');
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const fileUrl = await uploadFile();

            const data = {
                title: values.title,
                file: fileUrl,
                doc_type: values.doc_type
            };

            console.log("Form Data: ", data);
            const response = await axios.post(`http://localhost:8072/api/instructor/course/${selectedCourseId}/content`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            setLoading(false);
            setFileUpload(null);
            message.success(`Content added successfully! ${response.data}`);
            handleViewDetails(selectedCourseId);
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            message.error('Failed to add content. Please try again.');
        }
    };

    const handleDeleteCourse = async () => {
        try {
            await axios.delete(`http://localhost:8072/api/instructor/course/${selectedCourseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            message.success('Course deleted successfully!');
            setModalVisible(false);
            const instructorId = localStorage.getItem('instructorId');
            const response = await axios.get(`http://localhost:8072/api/instructor/${instructorId}/courses`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error:', error.message);
            message.error('Failed to delete course. Please try again.');
        }
    };

    const handleenrollment = async () => {
        try {
            const response = await axios.get(`http://localhost:8073/api/learner/all-course-learners/663cb00d7103c1a0201496db`);
            if (Array.isArray(response.data.students)) {
                setEnrolldata(response.data.students);
                console.log("Enrollment API response:", response.data.students);
                message.info('Enrollment data fetched successfully!');
            } else {
                console.error('Error: API response is not an array');
                message.error('Failed to fetch data. Please try again.');
                setEnrolldata([]);
            }
        } catch (error) {
            console.error('Error:', error.message);
            message.error('Failed to fetch enrollment data. Please try again.');
            setEnrolldata([]);
        }
    };

    const fetchEnrollmentByCourseIdAndLearnerId = async (Studentid) => {
        try {
          const response = await fetch(
            `http://localhost:8073/api/learner/enrollments/${Studentid}?courseId=${selectedCourseId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          if (response.ok) {
            const enrollments = await response.json();
            // Calculate progress count from enrollments
            const progressCount = enrollments.reduce(
              (count, enrollment) => count + enrollment.progress.length,
              0
            );
            setProgressCount(progressCount);
          } else {
            message.error("Failed to fetch enrollment details");
          }
        } catch (error) {
          console.error("Error:", error);
          message.error("An error occurred. Please try again.");
        }
      };

    const handleCourseprogres =async (studentID) =>{
        setprogesslernerID(studentID);
        await fetchEnrollmentByCourseIdAndLearnerId(studentID);
    }

    const renderEnrollmentTable = () => {
        return (
            <div>
                <center><h2>Enrolled Learners</h2></center>
                <table className="enrollment-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Description</th>
                            <th>User Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrolldata.map((learner) => (
                            <tr key={learner._id} onClick={()=> handleCourseprogres(learner._id)}>
                                <td>{learner.name}</td>
                                <td>{learner.email}</td>
                                <td>{learner.description}</td>
                                <td>{learner.userType}</td>
                            </tr>
                        ))}
                    </tbody>
                {progesslernerID && (
                    <div>
                        <h3>Progress of the Learner</h3>
                        <Progress percent={(progressCount / totalContentCount) * 100} />
                    </div>
                )}
                </table>
                
            </div>
        );
    };

    return (
        <div style={{ padding: '10px' }}>
            <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>All Courses</h1>
            <div className="input-group rounded" style={{backgroundColor: '#9FA6B2'}}>
                <Input
                    placeholder="Search Course by Title"
                    style={{ marginBottom: '5px', marginTop:'5px',marginLeft:'5px', width: '300px',backgroundColor: '#CCFFFF', borderRadius: '5px'}}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}     
                />
                <CiSearch style={{ marginLeft: '5px', marginRight: '5px', marginTop:'10px', marginBottom: '10px', fontSize: '25px', color: '#CCFFFF' }} />
            </div>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message={error} type="error" />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {filteredCourses.map(course => (
                        <Card
                            key={course._id}
                            title={course.title}
                            style={{ width: 300, margin: '10px', backgroundColor:
                                    course.status === 'pending' ? 'orange' :
                                        course.status === 'rejected' ? 'red' :
                                            course.status === 'accepted' ? 'green' : 'white',
                                borderRadius: '10px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer'
                            }}
                            hoverable
                            onClick={() => handleViewDetails(course._id)}
                        >
                            <p style={{ marginBottom: '10px' }}><strong>Description:</strong> {course.description}</p>
                            <p style={{ marginBottom: '10px' }}><strong>Requirements:</strong> {course.requirements}</p>
                            <p style={{ marginBottom: '10px' }}><strong>Price:</strong> {course.price}</p>
                            <p><strong>Status:</strong> {course.status}</p>
                        </Card>
                    ))}
                </div>
            )}
<Modal
    title={<div style={{ textAlign: 'center', width: '100%', fontSize: '24px', fontWeight: 'bold' }}>Course Details</div>}
    visible={modalVisible}
    onCancel={handleModalClose}
    footer={[
        <button className="btn btn-danger" key="delete" onClick={handleDeleteCourse}>Delete</button>,
        <button className="btn btn-success mx-2" key="students" onClick={handleenrollment}>Enrollments</button>,
        <button className="btn btn-warning" key="cancel" onClick={handleModalClose}>Cancel</button>
    ]}
    width="80%"
    destroyOnClose
    className="modal-custom"
    modalClassName="modal-header-custom modal-body-custom modal-footer-custom"
>
                {course && (
                    <div style={{ overflowY: 'auto' }}>
        <Card
            title={
                <div style={{
                    textAlign: 'center', // Centers the title text
                    color: '#0056b3', // Sets the title color to a specific blue
                    fontSize: '24px', // Sets a larger font size for the title
                    fontWeight: 'bold' // Optionally makes the font bold
                }}>
                    {course.title}
                </div>
            }
            style={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}
        >
                            <div className="my-3">
    <p className="fs-5 fw-bold text-secondary">Description:</p>
    <p className="fs-6">{course.description}</p>
</div>
<div className="my-3">
    <p className="fs-5 fw-bold text-secondary">Requirements:</p>
    <p className="fs-6">{course.requirements}</p>
</div>
<div className="my-3">
    <p className="fs-5 fw-bold text-secondary">Price:</p>
    <p className="fs-6">${course.price}</p>
</div>
<h2 style={{ fontSize: '18px' }} className="mb-3 text-primary text-center">Course Content</h2>
                            {course.content.map((contentItem, index) => (
                                <div key={index}>
                                    <p><strong>Title:</strong> {contentItem.title}</p>
                                    {contentItem.doc_type === 'video' && contentItem.url && (
                                        <ReactPlayer url={contentItem.url} controls width="100%" />
                                    )}
                                    {contentItem.doc_type !== 'video' && (
                                        <p><strong>File:</strong> <a href={contentItem.url}>{contentItem.url}</a></p>
                                    )}
                                    <hr/>
                                </div>
                            ))}
                            <h2 style={{ fontSize: '18px' }} className="mb-3 text-primary">Add New Content</h2>

                            <Form name="addContentForm" form={form} onFinish={onFinish}>
                                <Form.Item
                                    name="title"
                                    rules={[{required: true, message: 'Please enter the title of the content!'}]}
                                >
                                    <Input placeholder="Content Title"/>
                                </Form.Item>

                                <Form.Item
    name="doc_type"
    label="Content Type"
    rules={[{ required: true, message: 'Please select the content type!' }]}
    className="form-label" // Bootstrap classes can also be added here if necessary
>
<Radio.Group className="custom-radio-buttons">
    <Radio.Button value="video">Video</Radio.Button>
    <Radio.Button value="file">File</Radio.Button>
</Radio.Group>
</Form.Item>


                                <Form.Item
                                    name="file"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                    rules={[{required: true, message: 'Please upload a file!'}]}
                                >
<Upload
    name="file"
    maxCount={1}  // Fix: Added the closing brace here.
    accept=".pdf,.mp4"
    beforeUpload={(file) => {
        setFileUpload(file);
        return false;
    }}
>
    <Button icon={<UploadOutlined/>}>Select File</Button>
</Upload>

                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} >Add Content</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                )}
                <br/>
                {enrolldata && renderEnrollmentTable()}
</Modal>
        </div>
    );
};

export default GetAllCoursesByInstructorId;

