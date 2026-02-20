const ShimmerCard = () => {
  return (
    <div className="task-card w-100">
      <div className="placeholder-glow w-100">
        
        <span className="placeholder col-3 mb-3 rounded-pill d-block"></span>

        <span className="placeholder col-8 mb-2 d-block"></span>

        <span className="placeholder col-6 mb-3 d-block"></span>

        <span className="placeholder col-4 mb-3 rounded-pill d-block"></span>

        <div className="d-flex gap-2 mt-2">
          <span className="placeholder col-4 rounded"></span>
          <span className="placeholder col-4 rounded"></span>
        </div>

      </div>
    </div>
  );
};
export default ShimmerCard;