const LoadingPopup = ({ user }) => {
  return (
    <div className="popup-container">
      <div className="popup popup--small">
        <p>Authenticating{user && " " + user.username}...</p>
        <div className="loading-animation">
          <div className="loadingio-spinner-eclipse-osisb6eiupo">
            <div className="ldio-8w8am58tzjr">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;
