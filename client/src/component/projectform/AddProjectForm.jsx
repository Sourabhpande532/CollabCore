/* eslint-disable no-unused-vars */
import { useState } from "react";
import { createProject } from "../../api/project.api";
import toast from "react-hot-toast";

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
    <form onSubmit={handleSubmit}>
      {/* Project Name */}
      <div className='mb-3'>
        <label className='form-label fw-semibold'>Project Name</label>
        <input
          type='text'
          className='form-control'
          name='name'
          placeholder='e.g. Mobile App Launch'
          value={form.name}
          required
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className='mb-4'>
        <label className='form-label fw-semibold'>Project Description</label>
        <textarea
          className='form-control'
          name='description'
          placeholder='Describe the project goals and timeline'
          rows='3'
          value={form.description}
          required
          onChange={handleChange}
        />
      </div>

      {/* Action Buttons */}
      <div className='d-flex justify-content-end gap-2'>
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
