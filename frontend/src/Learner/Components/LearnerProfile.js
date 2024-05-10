import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserOutlined} from "@ant-design/icons";

const LearnerProfile = () => {
    const [learnerProfile, setLearnerProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLearnerProfile();
    }, []);

    const fetchLearnerProfile = async () => {
        try {
            const response = await fetch('http://localhost:8073/api/learner/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLearnerProfile(data);
            } else {
                message.error('Failed to fetch learner profile');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8073/api/learner/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                message.success('Learner profile updated successfully');
                fetchLearnerProfile();
            } else {
                const data = await response.json();
                message.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <center>
                <UserOutlined style={{fontSize:'50px'}} />
                <h1>Learner Profile</h1>
            </center>
            {learnerProfile && (
                <Form
                    name="learner-profile-form"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: learnerProfile.name,
                        email: learnerProfile.email,
                        description: learnerProfile.description
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input your name!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {required: true, message: 'Please input your email!'},
                            {type: 'email', message: 'Please enter a valid email address!'}
                        ]}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default LearnerProfile;
