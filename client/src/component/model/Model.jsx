import ReactDOM from "react-dom";
import "./modelcss/model.css";

const Modal = ({ show, onClose, title, size, children }) => {
  if (!show) return null;

  const sizeClass = size ? `modal-box-${size}` : "";

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${sizeClass}`.trim()} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{title}</h5>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">×</button>
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
