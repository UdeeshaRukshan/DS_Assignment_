import React, { useState, useEffect } from "react";
import { Card, Spin, message, Modal } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPlayer from "react-player";
import { Button, ProgressBar } from "react-bootstrap";
import courseBg from "../../assets/images/course-bg.png";
import HoverRating from "../../components/feedback/muiFeedback";
import RatingsDisplay from "../../components/feedback/RatingDisplay";

export default function LearnerMyCourses() {
  // State variables
  const [courses, setCourses] = useState([]); // Course list
  const [loading, setLoading] = useState(false); // Loading indicator
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [selectedCourse, setSelectedCourse] = useState(null); // Selected course details
  const [completedContents, setCompletedContents] = useState({}); // Completed content for each course
  const [progressCount, setProgressCount] = useState(0); // Total progress count

  // Get learner ID from token
  const learnerId = JSON.parse(
    atob(localStorage.getItem("token").split(".")[1])
  ).id;
  // Fetch enrolled courses on component mount
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);
  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    setLoading(true);
    try {
      // Fetch enrollments for the learner
      const response = await fetch(
        `http://localhost:8073/api/learner/enrollments/${learnerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        // Extract course IDs from enrollments
        const enrollments = await response.json();
        const courseIds = enrollments.map((enrollment) => enrollment.course);
        // Fetch courses based on course IDs
        await fetchCourses(courseIds);
      } else {
        message.error("Failed to fetch enrolled courses");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };
  // Fetch courses based on course IDs
  const fetchCourses = async (courseIds) => {
    try {
      // Fetch all courses
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
        // Filter courses based on enrolled course IDs
        const data = await response.json();
        const enrolledCourses = data.filter((course) =>
          courseIds.includes(course._id)
        );

        // Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          enrolledCourses.map(async (course) => {
            // Fetch progress details for the course
            const progressResponse = await fetch(
              `http://localhost:8073/api/learner/enrollments/${learnerId}?courseId=${course._id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (progressResponse.ok) {
              // Calculate progress count
              const progressData = await progressResponse.json();
              const progressCount = progressData.reduce(
                (count, enrollment) =>
                  count + new Set(enrollment.progress).size,
                0
              );

              // Initialize completed contents for each course
              const completed = new Set(
                progressData.flatMap((enrollment) => enrollment.progress)
              );
              setCompletedContents((prevState) => ({
                ...prevState,
                [course._id]: completed,
              }));

              return { ...course, progressCount };
            }
            return { ...course, progressCount: 0 };
          })
        );

        setCourses(coursesWithProgress);
      } else {
        message.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  // Handle unenrollment from a course
  const handleUnenroll = async () => {
    try {
      // Send unenrollment request to the server
      const response = await fetch(
        "http://localhost:8073/api/learner/enrollments",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ courseId: selectedCourse._id }),
        }
      );

      if (response.ok) {
        message.success("Unenrolled successfully");
        closeModal();
        fetchEnrolledCourses();
      } else {
        message.error("Failed to unenroll");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  // Fetch enrollment details by course ID and learner ID
  const fetchEnrollmentByCourseIdAndLearnerId = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:8073/api/learner/enrollments/${learnerId}?courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const enrollments = await response.json();
        const progressCount = enrollments.reduce(
          (count, enrollment) => count + new Set(enrollment.progress).size,
          0
        );

        // Initialize completed contents for selected course
        const completed = new Set(
          enrollments.flatMap((enrollment) => enrollment.progress)
        );
        setCompletedContents((prevState) => ({
          ...prevState,
          [courseId]: completed,
        }));

        setProgressCount(progressCount);
      } else {
        message.error("Failed to fetch enrollment details");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  // Handle content click
  const handleClickContent = async (contentId, docType) => {
    if (!selectedCourse) return;
    if (docType === "file" || docType === "video") {
      if (!completedContents[selectedCourse._id]) {
        // Initialize the completedContents for the selected course if it's undefined
        setCompletedContents((prevState) => ({
          ...prevState,
          [selectedCourse._id]: new Set(),
        }));
      }

      if (!completedContents[selectedCourse._id].has(contentId)) {
        try {
          // Mark content as completed
          const response = await fetch(
            "http://localhost:8073/api/learner/enrollments/progress",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ contentId, completed: true }),
            }
          );

          if (response.ok) {
            message.success("Content marked as completed");
            await fetchEnrollmentByCourseIdAndLearnerId(selectedCourse._id);

            // Update the progress dynamically
            setSelectedCourse((prevCourse) => ({
              ...prevCourse,
              progressCount: prevCourse.progressCount + 1,
            }));

            // Add the contentId to the completedContents set
            setCompletedContents((prevState) => {
              const updatedSet = new Set(prevState[selectedCourse._id]);
              updatedSet.add(contentId);
              return {
                ...prevState,
                [selectedCourse._id]: updatedSet,
              };
            });
          } else {
            message.error("Failed to mark content as completed");
          }
        } catch (error) {
          console.error("Error:", error);
          message.error("An error occurred. Please try again.");
        }
      } else {
        // Content already marked as completed
        message.info("Content already marked as completed");
      }
    } else {
      // Clicked item is not a file or video
      // message.info("Rating or title clicked, progress not updated");
    }
  };
  // Handle card click
  const handleCardClick = async (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
    await fetchEnrollmentByCourseIdAndLearnerId(course._id);
  };
  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

  return (
    <div className="container mt-0">
      <h2>Learner My Courses</h2>
      <Spin spinning={loading}>
        <div className="row mt-4">
          {courses.map((course, index) => (
            <div key={course._id} className="col-md-4 mb-4">
              <Card
                title={course.title}
                style={{ width: "100%" }}
                onClick={() => handleCardClick(course)}
              >
                <center>
                  <img src={courseBg} alt="course" style={{ width: "150px" }} />
                </center>
                <p>{course.requirements}</p>
                <div className="row"></div>
                <ProgressBar
                  now={Math.min(
                    (
                      (course.progressCount / course.content.length) *
                      100
                    ).toFixed(2),
                    100
                  )}
                  label={`${Math.min(
                    (
                      (course.progressCount / course.content.length) *
                      100
                    ).toFixed(2),
                    100
                  )}%`}
                  variant="success"
                />
                <RatingsDisplay key={index} idValue={course._id} />
              </Card>
            </div>
          ))}
        </div>
      </Spin>
      <Modal
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        width="80%"
      >
        {selectedCourse && (
          <div>
            <h2 className="text-center text-secondary fw-bold fs-2">
              Course Content
            </h2>
            {selectedCourse.content.map((contentItem, index) => (
              <div
                key={index}
                onClick={() =>
                  handleClickContent(contentItem._id, contentItem.doc_type)
                }
                style={{ cursor: "pointer" }}
                className="mb-3"
              >
                <p className="fw-bold fs-5 text-dark">
                  <strong>Title:</strong> {contentItem.title}
                </p>
                {contentItem.doc_type === "video" && contentItem.url && (
                  <ReactPlayer url={contentItem.url} controls width="100%" />
                )}
                {contentItem.doc_type !== "video" && (
                  <p className="fw-bold fs-6 text-dark">
                    <strong>File:</strong>{" "}
                    <a href={contentItem.url}>{contentItem.url}</a>
                  </p>
                )}
                <hr />
                <HoverRating key={index} idValue={contentItem._id} />
              </div>
            ))}
            <center>
              <ProgressBar
                now={Math.min(
                  (
                    (progressCount / selectedCourse.content.length) *
                    100
                  ).toFixed(2),
                  100
                )}
                label={`${Math.min(
                  (
                    (progressCount / selectedCourse.content.length) *
                    100
                  ).toFixed(2),
                  100
                )}%`}
                variant="success"
                className="w-50"
              />
              <br />
              <br />
              <Button
                type="danger"
                className="btn btn-danger"
                onClick={handleUnenroll}
              >
                Unenroll
              </Button>
            </center>
          </div>
        )}
      </Modal>
    </div>
  );
}
