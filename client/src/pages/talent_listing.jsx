import { useState} from "react";

export default function Talent_list() {

    const [skillInput, setSkillInput] = useState("");
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "",
    pricing_type: "Hourly",
    rate: "",
    availability: "Available",
    skills: [],
    image: null,
  });
 
  const addSkill = () => {
  const skill = skillInput.trim();

  if (!skill) return;

  if (formData.skills.includes(skill)) return;

  setFormData({
    ...formData,
    skills: [...formData.skills, skill],
  });

  setSkillInput("");
};

const removeSkill = (skillToRemove) => {
  setFormData({
    ...formData,
    skills: formData.skills.filter(
      (skill) => skill !== skillToRemove
    ),
  });
};

 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

  setErrors({
    ...errors,
    [e.target.name]: "",
  });
};
  
  const imagePreview = formData.image
  ? URL.createObjectURL(formData.image)
  : null;

 const validateForm = () => {
  const newErrors = {};

  // Full Name
  if (!formData.full_name.trim()) {
    newErrors.full_name = "Full Name is required.";
  } else if (formData.full_name.trim().length < 2) {
    newErrors.full_name = "Full Name must be at least 2 characters.";
  }

  // Title
  if (!formData.title.trim()) {
    newErrors.title = "Title is required.";
  }

  // Bio
  if (formData.bio.length > 500) {
    newErrors.bio = "Bio cannot exceed 500 characters.";
  }

  // Rate
  if (!formData.rate) {
    newErrors.rate = "Rate is required.";
  } else if (Number(formData.rate) <= 0) {
    newErrors.rate = "Rate must be greater than 0.";
  }

  // Skills
  if (formData.skills.length === 0) {
    newErrors.skills = "Please add at least one skill.";
  }

  // Image
  if (!formData.image) {
    newErrors.image = "Please upload a profile image.";
  } else {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(formData.image.type)) {
      newErrors.image =
        "Only JPG, PNG and WEBP images are allowed.";
    }

    if (formData.image.size > 5 * 1024 * 1024) {
      newErrors.image =
        "Image size must be less than 5MB.";
    }
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const data = new FormData();

  data.append("full_name", formData.full_name);
  data.append("title", formData.title);
  data.append("bio", formData.bio);
  data.append("pricing_type", formData.pricing_type);
  data.append("rate", formData.rate);
  data.append("availability", formData.availability);

  data.append("skills", JSON.stringify(formData.skills));

  data.append("image", formData.image);

  try {
    const response = await fetch("http://localhost:5000/api/talents", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Talent Profile</h1>
          <p className="text-gray-600">
            Showcase your skills and let clients find you.
          </p>
        </div>

        <form className="space-y-6"  onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-2">
              Profile Image
            </label>

            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 border rounded-lg flex items-center justify-center overflow-hidden">
             {formData.image ? (
             <img
             src={imagePreview}
             alt="Profile Preview"
             className="w-full h-full object-cover"
             />
             ) : (
             <span className="text-gray-400">
             Preview
             </span>
             )} 
            </div>

              <label className="cursor-pointer">
               <div className="border rounded-md px-4 py-2 bg-white hover:bg-gray-100 text-center mt-3">
                  Upload Image
                </div>
                <input type="file" name="image" accept="image/*" className="hidden"
              onChange={(e) => {
              const file = e.target.files[0];

              setFormData({
                ...formData,
                image: file,
              });

              setErrors({
                ...errors,
                image: "",
              });
            }}
                />
              </label>
              {errors.image && (
              <p className="text-red-500 text-sm mt-2">
              {errors.image}
              </p>
              )}
            </div>
          

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text" placeholder="bikash" name="full_name" className="w-full border rounded-md p-3 bg-white"
               value={formData.full_name}
               onChange={handleChange}
            />
            {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">
            {errors.full_name}
           </p>
           )}
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Title
            </label>

            <input
              type="text" placeholder="Frontend Developer" name="title" className="w-full border rounded-md p-3 bg-white"
               value={formData.title}
               onChange={handleChange}
            />
            {errors.title && (
            <p className="text-red-500 text-sm mt-1">
            {errors.title}
            </p>
           )}
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Bio
            </label>

            <textarea
              rows="5" name="bio" placeholder="A couple of sentences about how you work." className="w-full border rounded-md p-3 bg-white resize-none"
             value={formData.bio}
             onChange={handleChange}
            />
            {errors.bio && (
            <p className="text-red-500 text-sm mt-1">
            {errors.bio}
            </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                <select name="pricing_type"
                 value={formData.pricing_type}
                  onChange={handleChange}>
                <option>Hourly</option>
                <option>work based</option>
              
              </select>
              </label>

              <input
                type="number" name="rate" placeholder="60" className="w-full border rounded-md p-3 bg-white"
                 value={formData.rate}
                 onChange={handleChange}
              />
              {errors.rate && (
              <p className="text-red-500 text-sm mt-1">
              {errors.rate}
              </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Availability
              </label>

              <select name="availability" className="w-full border rounded-md p-3 bg-white"
               value={formData.availability}
               onChange={handleChange}
              >
                <option>Available</option>
                <option>Busy</option>
                <option>Part Time</option>
                <option>Unavailable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Skills
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text" placeholder="Add a skill and press Enter" className="flex-1 border rounded-md p-3 bg-white"
                  value={skillInput}
                 onChange={(e) => setSkillInput(e.target.value)}
              />
              {errors.skills && (
              <p className="text-red-500 text-sm mt-2">
              {errors.skills}
              </p>
              )}

              <button
                type="button"
                 onClick={addSkill}
                className="border rounded-md px-5 py-3 bg-white hover:bg-gray-100 text-xl sm:w-auto w-full"
              >
                +
              </button>
            </div>
              
             <div>
              {formData.skills.map((skill) => (
             <div key={skill}
             className="flex flex-wrap items-center gap-2 mt-2">
             <span className="bg-gray-100 px-3 py-1 rounded-full">
              {skill}
              </span>

            <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-2 rounded"
            onClick={() => removeSkill(skill)}
            >
            x
           </button>
           </div>
            ))}
          </div>

          </div>

          <button type="submit" className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}