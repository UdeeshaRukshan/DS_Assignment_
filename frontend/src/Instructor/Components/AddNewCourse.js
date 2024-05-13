import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddNewCourse = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { title, description, requirements, price } = values;
            const formData = {
                title,
                description,
                requirements,
                price,
                instructorId: localStorage.getItem('instructorId')
            };

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8072/api/instructor/courses', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                message.success('Course added successfully');
                navigate("/instructor/home/");
            } else {
                message.error('Failed to add new course. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            message.error(error.response?.data.message || 'Failed to add new course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center align-items-center">
                <Col xs={12} md={8} lg={6}>
                    <Card className="shadow-sm p-4 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title>Add New Course</Card.Title>
                            <Form
                                name="addCourse"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    label="Title"
                                    name="title"
                                    rules={[{ required: true, message: 'Please input the title of the course!' }]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[{ required: true, message: 'Please input the description of the course!' }]}
                                >
                                    <Input.TextArea autoSize={{ minRows: 6 }} className="large-text-area" />
                                </Form.Item>

                                <Form.Item
                                    label="Requirements"
                                    name="requirements"
                                >
                                    <Input.TextArea autoSize={{ minRows: 6 }} className="large-text-area" />
                                </Form.Item>



                                <Form.Item
                                    label="Price"
                                    name="price"
                                    rules={[
                                        { required: true, message: 'Please input the price of the course!' },
                                        {
                                            validator: (_, value) =>
                                                !isNaN(value) && parseFloat(value) >= 0 ?
                                                Promise.resolve() : Promise.reject('Please input a valid price!')
                                        }
                                    ]}
                                >
                                    <Input type="number" size="large" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} block>
                                        Add Course
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddNewCourse;
