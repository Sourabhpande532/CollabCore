import ReactDOM from "react-dom";
import "./modelcss/model.css";

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{title}</h5>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
