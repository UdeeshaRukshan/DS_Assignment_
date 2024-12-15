import React, { useEffect, useState } from "react";
import { Card, Input, message, Modal, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import courseBg from "../../assets/images/course-bg.png";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Search } = Input;

const LearnerAllCourses = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const learnerId = JSON.parse(
    atob(localStorage.getItem("token").split(".")[1])
  ).id;
  // Fetch all courses when component mounts
  useEffect(() => {
    fetchAllCourses();
  }, []);
  // Function to fetch all courses
  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8073/api/learner/all-courses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const acceptedCourses = data.filter(
          (course) => course.status === "accepted"
        );
        setCourses(acceptedCourses);
      } else {
        message.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };
  // Function to handle adding a course to cart
  const handleAddToCart = async (courseId, title, description, price) => {
    try {
      const response = await fetch(
        "http://localhost:8073/api/learner/add-to-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            learnerId,
            courseId,
            title,
            description,
            price,
          }),
        }
      );

      if (response.ok) {
        message.success("Course added to cart successfully");
      } else {
        const data = await response.json();
        if (
          response.status === 400 &&
          data.message === "Course is already in the cart"
        ) {
          message.error(data.message);
        } else {
          message.error("Failed to add course to cart");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  // Filtered courses based on search value
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  // Function to handle click on card
  const handleCardClick = (course) => {
    setSelectedCourse(course);
    showModal();
  };
  // Modal state and functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container">
      <h3>All Courses</h3>
      <center>
        <Search
          placeholder="Search by course title"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 400, marginBottom: "20px" }}
        />
      </center>
      <Spin spinning={loading}>
        <div className="row mt-4">
          {filteredCourses.map((course) => (
            <div key={course._id} className="col-md-4 mb-4">
              <Card
                className="rounded-5 shadow-sm"
                style={{ width: "100%" }}
                onClick={() => handleCardClick(course)}
              >
                <div className="row">
                  <center>
                    <img
                      src={courseBg}
                      alt="course"
                      style={{ width: "150px" }}
                    />
                  </center>
                </div>
                <div className="row">
                  <center>
                    <h5 className="fw-bold fs-4 text-dark">{course.title}</h5>
                  </center>
                </div>
                <div className="row">
                  <center>
                    <p className="fw-bold text-danger fs-4">${course.price}</p>
                  </center>
                </div>
                <div className="row">
                  <center>
                    <div
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(
                          course._id,
                          course.title,
                          course.description,
                          course.price
                        );
                      }}
                    >
                      <ShoppingCartOutlined
                        style={{ fontSize: "25px", color: "#9b9b9b" }}
                      />
                    </div>
                  </center>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Spin>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
      >
        {selectedCourse && (
          <>
            <div className="row">
              <div className="col">
                <div className="row">
                  <h1 className="text-light bg-dark mb-3">
                    {selectedCourse.title}
                  </h1>
                </div>
                <div className="row">
                  <p
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    {selectedCourse.description}
                  </p>
                </div>
                <div className="row">
                  <h5
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    Requirements:
                  </h5>
                  <p
                    style={{
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    {selectedCourse.requirements}
                  </p>
                </div>
                <div className="row">
                  <h5
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    Price:
                  </h5>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "red",
                    }}
                  >
                    ${selectedCourse.price}
                  </p>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div
                      className="btn btn-warning w-100 mt-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(
                          selectedCourse._id,
                          selectedCourse.title,
                          selectedCourse.description,
                          selectedCourse.price
                        );
                      }}
                    >
                      Add to Cart
                    </div>
                  </div>
                  <div className="col"></div>
                </div>
              </div>
              <div className="col-4">
                <img src={courseBg} alt="course" style={{ width: "100%" }} />
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LearnerAllCourses;
