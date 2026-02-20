import ShimmerCard from "./ShimmerCard";

const ShimmerGrid = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </>
  );
};

export default ShimmerGrid;