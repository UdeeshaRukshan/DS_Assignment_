import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
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
            if (error.response) {
                message.error(error.response.data.message || 'Failed to add new course. Please try again.');
            } else {
                message.error('Failed to connect to the server. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row justify="center" align="middle">
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card title="Add New Course" className="rounded shadow-sm">
                        <Form
                            name="addCourse"
                            initialValues={{ remember: true }}
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
                                <Input.TextArea autoSize={{ minRows: 3 }} />
                            </Form.Item>

                            <Form.Item
                                label="Requirements"
                                name="requirements"
                            >
                                <Input.TextArea autoSize={{ minRows: 3 }} />
                            </Form.Item>

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: 'Please input the price of the course!' },
                                    {
                                        validator: (_, value) => {
                                            if (!isNaN(value) && parseFloat(value) >= 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please input a valid price!');
                                        }
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
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddNewCourse;
