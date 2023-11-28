const Notification = ({ message, positive }) => {
  if (message === "") {
    return null;
  }

  if (positive) {
    return <div className="success">{message}</div>;
  }

  return <div className="error">{message}</div>;
};

export default Notification;
