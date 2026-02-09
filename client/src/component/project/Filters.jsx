import "./project.css";
const Filters = ({ searchParams, setSearchParams }) => {
  const updateFilter = (key, value) => {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  return (
    <div className='filters-box mt-4'>
      <select onChange={(e) => updateFilter("status", e.target.value)}>
        <option value=''>Status</option>
        <option value='Completed'>Completed</option>
        <option value='InProgress'>In Progress</option>
      </select>

      <select onChange={(e) => updateFilter("tags", e.target.value)}>
        <option value=''>Tags</option>
        <option value='Urgent'>Urgent</option>
        <option value='Support'>Support</option>
      </select>

      <select onChange={(e) => updateFilter("owners", e.target.value)}>
        <option value=''>Owner</option>
        <option value='Ajay'>Ajay</option>
        <option value='Rahul'>Rahul</option>
      </select>
    </div>
  );
};

export default Filters;
