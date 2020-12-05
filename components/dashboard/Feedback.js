import React, { useState, useContext, useEffect } from "react";
import Button from "../general/Button";
import { send } from "../../lib/api";
import { UserContext } from "../../contexts/userContext";
import { toast } from "react-toastify";

const Feedback = () => {
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false); // True -> form is visible
  const [hidden, setHidden] = useState(false); // True -> popup button is hidden
  const [feedbackGrade, setFeedbackGrade] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const handleChangeFeedbackText = (event) => {
    setFeedbackText(event.target.value);
  };
  const drawGrade = (grade) => {
    let gradeText = "";
    switch (grade) {
      case 1:
        gradeText = "Very unsatisfied";
        break;
      case 3:
        gradeText = "Neutral";
        break;
      case 5:
        gradeText = "Very satisfied";
        break;
    }
    return (
      <div className="feedback__grade-container">
        <div
          className={
            `feedback__grade ` +
            (grade === feedbackGrade ? "feedback__grade--selected" : "")
          }
          onClick={() => setFeedbackGrade(grade)}
        >
          {grade}
        </div>
        <p className="feedback__grade--gradeText">{gradeText}</p>
      </div>
    );
  };
  const drawGrades = () => {
    const grades = [1, 2, 3, 4, 5];
    return (
      <div className="feedback__grades-container">
        {grades.map((grade) => drawGrade(grade))}
      </div>
    );
  };
  const handleSend = async () => {
    // Force grade but not text
    if (!feedbackGrade) {
      return toast.error("⚠️ Please provide a grade");
    }

    const { _id: id, username, email } = user;
    await send({
      type: "SEND_FEEDBACK",
      id,
      username,
      email,
      feedbackGrade,
      feedbackText,
    }).then(
      (data) => {
        toast.success("✅ Thank you for your feedback!");
        hideForAWhile();
      },
      (err) => {
        toast.error(`⚠️ ${err}`);
        console.error("sendFeedback err:", err);
      }
    );
  };
  // Hide the feedback button for a set time
  const hideForAWhile = () => {
    setHidden(true);
    localStorage.setItem("feedback", JSON.stringify(Date.now()));
  };
  // See if timeout is over; only then show the feedback button again
  const shouldShow = () => {
    const date = JSON.parse(localStorage.getItem("feedback"));
    const timeout = 1; // 24 hours
    return Date.now() - date > timeout;
  };
  useEffect(() => {
    if (!shouldShow()) {
      setHidden(true);
    }
  }, []);
  if (hidden) return <></>;
  if (!visible)
    return (
      <div className="feedback--button" onClick={() => setVisible(true)}>
        Feedback
        <a className="feedback--close" onClick={hideForAWhile}>
          x
        </a>
      </div>
    );
  return (
    <div className="feedback">
      <div className="feedback__header">
        <h4>Rate this page</h4>
        <h4
          className="feedback__header--close"
          onClick={() => setVisible(false)}
        >
          x
        </h4>
      </div>
      <div className="feedback__body">
        <form>
          <p>How satisfied are you with {process.env.APP_NAME}?</p>
          {drawGrades()}

          <p>What is your feedback?</p>
          <textarea
            type="feedbackText"
            id="feedbackText"
            name="feedbackText"
            value={feedbackText}
            onChange={handleChangeFeedbackText}
          />

          <div className="feedback__body--actions">
            <Button text="Send" altText="Sending..." fn={handleSend} />
            <Button text="Cancel" color="red" fn={() => setVisible(false)} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
