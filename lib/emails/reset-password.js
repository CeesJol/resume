const ConfirmEmail = (token) => {
  return `<div style="background-color: #fafafa; width: 100vw; height: 100vh; margin: 0; margin-top: 30px; padding: 0; position: relative;">
	<div style="position: relative; margin: 0 auto; max-width: 400px;">
	<h1>${process.env.APP_NAME}</h1>
	<div style="background-color: white; border: 1px solid lightgrey; border-radius: 10px; margin: 0 auto; padding: 10px 10px 30px 10px;">
	<p>You requested us to reset your password.</p>
	<br /> <a href="${process.env.DOMAIN_NAME}/reset-password/${token}"> <button style="background-color: green; border: none; color: white; padding: 10px; border-radius: 2px; width: 100%; cursor: pointer;">Reset password</button> </a> <br /><br />
	<p>Or, alternatively, copy the link below in your browser:</p>
	<a href="${process.env.DOMAIN_NAME}/reset-password/${token}">${process.env.DOMAIN_NAME}/reset-password/${token}</a></div>
	<p>If you did not request to reset your password, please ignore this email. The link is valid for 30 minutes.</p>
	</div>
	</div>`;
};

export default ConfirmEmail;
