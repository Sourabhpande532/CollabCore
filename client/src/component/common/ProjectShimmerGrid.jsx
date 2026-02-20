import ProjectShimmerCard from "./ProjectShimmerCard";

const ProjectShimmerGrid = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProjectShimmerCard key={i} />
      ))}
    </>
  );
};

export default ProjectShimmerGrid;
