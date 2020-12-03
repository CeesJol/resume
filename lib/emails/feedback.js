const FeedbackEmail = (
  id,
  username,
  email,
  feedbackText,
  feedbackGrade
) => `<div style="background-color: #fafafa; width: 100vw; height: 100vh; margin: 0; margin-top: 30px; padding: 0; position: relative;">
<div style="position: relative; margin: 0 auto; max-width: 400px;">
<h1>${process.env.APP_NAME}</h1>
<div style="background-color: white; border: 1px solid lightgrey; border-radius: 10px; margin: 0 auto; padding: 10px 10px 30px 10px;">
<p>New feedback from:</p>
  <ul>
    <li>id: ${id}</li>
    <li>username: ${username}</li>
    <li>email: ${email}</li>
	</ul>
<p>Grade: ${feedbackGrade}</p>
<p>Feedback:</p>
  <p>
    ${feedbackText}
  </p>
</div>
</div>`;

export default FeedbackEmail;
