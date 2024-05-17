import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const LearnerSignup = () => {
  // State to manage loading state of sign-up button
  const [loading, setLoading] = useState(false);
  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Send sign-up request to backend
      const response = await axios.post(
        "http://localhost:8073/api/learner/register",
        values
      );
      setLoading(false);
      // If sign-up successful, show success notification and redirect to login page
      if (response.status === 201) {
        notification.success({ message: "Learner created successfully" });
      }
      window.location.href = "/login";
    } catch (error) {
      setLoading(false);
      // Show error notification with error message
      notification.error({
        message: "Failed to create learner",
        description: error.message,
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Learner Signup</h2>
      <Form name="learner_signup" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LearnerSignup;
