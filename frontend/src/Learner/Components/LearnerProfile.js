import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserOutlined } from "@ant-design/icons";

const LearnerProfile = () => {
  // State variables to manage learner profile data and loading state
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Function to fetch learner profile data from the server
  useEffect(() => {
    fetchLearnerProfile();
  }, []);

  const fetchLearnerProfile = async () => {
    try {
      // Fetch learner profile data from the server
      const response = await fetch(
        "http://localhost:8073/api/learner/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        // If successful, set the learner profile state
        const data = await response.json();
        setLearnerProfile(data);
      } else {
        // If error, display error message
        message.error("Failed to fetch learner profile");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  // Function to handle form submission and update learner profile
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Send a PUT request to update learner profile
      const response = await fetch(
        "http://localhost:8073/api/learner/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        // If successful, display success message and fetch updated profile
        message.success("Learner profile updated successfully");
        fetchLearnerProfile();
      } else {
        // If error, display error message
        const data = await response.json();
        message.error(data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-0" style={{ maxWidth: "600px" }}>
      <div className="text-center mb-3">
        <UserOutlined style={{ fontSize: "50px", color: "black" }} />
        <h1 style={{ color: "black" }}>Learner Profile</h1>
      </div>
      {learnerProfile && (
        <Form
          name="learner-profile-form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: learnerProfile.name,
            email: learnerProfile.email,
            description: learnerProfile.description,
            password: "", // Initialize password as an empty string
          }}
          style={{
            backgroundColor: "#f0f2f5",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Name</span>}
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input style={{ borderRadius: "4px" }} />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input style={{ borderRadius: "4px" }} disabled />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Description</span>}
            name="description"
          >
            <Input.TextArea style={{ borderRadius: "4px" }} />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>Password</span>}
            name="password"
            rules={[
              { message: "Please input your password!" },
              {
                min: 4,
                message: "Password must be at least 4 characters long!",
              },
            ]}
          >
            <Input.Password style={{ borderRadius: "4px" }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ borderRadius: "4px" }}
              className="w-100"
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default LearnerProfile;
