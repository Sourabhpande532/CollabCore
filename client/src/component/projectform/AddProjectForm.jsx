/* eslint-disable no-unused-vars */
import { useState } from "react";
import { createProject } from "../../api/project.api";
import toast from "react-hot-toast";
import "./project.css";

const AddProjectForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(form);
      onSuccess();
      onClose();
      toast.success("Project Added successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-project-form animate-fade-in">
      {/* Project Name */}
      <div className='form-group'>
        <label className='form-label'>Project Name</label>
        <input
          type='text'
          className='form-control'
          name='name'
          placeholder='What is the project name?'
          value={form.name}
          required
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className='form-group'>
        <label className='form-label'>Description</label>
        <textarea
          className='form-control'
          name='description'
          placeholder='What needs to be done in this project?'
          value={form.description}
          required
          onChange={handleChange}
        />
      </div>

      {/* Action Buttons */}
      <div className='d-flex justify-content-end gap-3 mt-4'>
        <button
          type='button'
          className='btn btn-outline-secondary'
          onClick={onClose}>
          Cancel
        </button>

        <button type='submit' className='btn btn-primary'>
          Create Project
        </button>
      </div>
    </form>
  );
};

export default AddProjectForm;
