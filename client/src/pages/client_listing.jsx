import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Client_list(){
const { user } = useAuth();

const [formData, setFormData] = useState({
  title: "",
  job_type: "",
  budget: "",
  description: "",
  location: "",
  deadline: "",
  contact_preference: "",
  image: null,
});

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleImageChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    image: e.target.files[0],
  }));
};

const handleSubmit = async () => {
  if (!formData.title.trim()) {
    return alert("Please enter a title.");
  }

  if (!formData.job_type) {
    return alert("Please select a job type.");
  }

  if (!formData.budget) {
    return alert("Please enter a budget.");
  }

  if (!formData.description.trim()) {
    return alert("Please enter a description.");
  }

  try {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("job_type", formData.job_type);
    data.append("budget", formData.budget);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("deadline", formData.deadline);
    data.append("contact_preference", formData.contact_preference);

    if (formData.image) {
      data.append("image", formData.image);
    }

    await api.post("/jobs", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Job posted successfully!");

setFormData({
  title: "",
  job_type: "",
  budget: "",
  description: "",
  location: "",
  deadline: "",
  contact_preference: "",
  image: null,
});

// Stay on this page

  } catch (err) {
    console.error(err);
    alert("Failed to post job.");
  }
};

if (user?.user_type === "admin") {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
        <p className="text-gray-600">
          Admins cannot post or list jobs.
        </p>
      </div>
    </div>
  );
}

return(
<div className="min-h-screen p-8">
  <div className="max-w-4xl mx-auto">
   <div className="mb-8">
    <h1 className="font-bold text -2x1">Let us know your preferences</h1>
    <p className="text-gray-600">Request the service you would like</p>
   </div>
   
   <div>
    <form className="space-y-6">
     <div>
      <label htmlFor="image" className="block font-semibold mb-2">
        Image
      </label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-white border rounded-md overflow-hidden flex items-center justify-center">
          {formData.image ? (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          ) : (
          <span className="text-gray-400">Preview</span>
          )}
         </div>
        <label className="cursor-pointer">
          <div className="bg-white border px-4 py-2 rounded-md">upload image</div>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
     </div>

     <div>
      <label htmlFor="title" className="block font -semibold mb-2">Title:</label>
      <input
        type="text"
        name="title"
        id="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="My sink is broken"
        className="w-full border rounded-md p-3 bg-white"
      />
     </div>
     <div>
      <label htmlFor="job_type">Type of Job</label>
      <select
      name="job_type"
      id="job_type"
      value={formData.job_type}
      onChange={handleChange}
      className="w-full border rounded-md p-3 bg-white"
    >
        <option>Plumbing</option>
        <option>cleaning</option>
        <option>Repair</option>
        <option>Others</option>
      </select>
     </div>

      <div>
        <label htmlFor="location" className="block font-semibold mb-2">
        Location
        </label>

        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Kathmandu"
          className="w-full border rounded-md p-3 bg-white"
        />
        </div>

     <div>
        <label htmlFor="budget" className="block font-semibold mb-2">
        Budget / Rate:
       </label>
      <input
        type="number"
        id="budget"
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        placeholder="$50"
        className="w-full border rounded-md p-3 bg-white"
        />
     </div>

    <div>
      <label htmlFor="description" className="block font-semibold mb-2">
        Description:
      </label>

      <textarea
      rows={5}
      name="description"
       id="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Explain what service you need..."
      className="w-full border rounded-md p-3 bg-white resize-none"
     />
    </div>
     <button type="button" onClick={handleSubmit} className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800">
        Post
      </button>

    </form>
   </div>

  </div>
</div>
)
}