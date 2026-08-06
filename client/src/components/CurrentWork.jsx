import { useEffect, useState, } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";


export default function CurrentWork() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submitting, setSubmitting] = useState(false);

 useEffect(() => {
  let mounted = true;

  async function loadJobs() {
    try {
      const { data } = await api.get("/jobs/current");

      if (mounted) {
        setJobs(data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);

      if (mounted) {
        setLoading(false);
      }
    }
  }

  loadJobs();

  return () => {
    mounted = false;
  };
}, []);

const refreshJobs = async () => {
  try {
    const { data } = await api.get("/jobs/current");
    setJobs(data);
  } catch (err) {
    console.error(err);
  }
};

  if (loading) {
    return (
      <div className="p-6">
        Loading current work...
      </div>
    );
  }

const completeJob = async (jobId) => {
  try {
    await api.patch(`/jobs/${jobId}/complete`);

    await refreshJobs();

    alert("Job completed successfully.");
  } catch (err) {
    console.error("Complete Job Error:", err);

    alert(
      err.response?.data?.error ||
      "Failed to complete job."
    );
  }
};

const submitRating = async (jobId) => {
  try {
    setSubmitting(true);

    console.log({
    jobId,
    stars: ratings[jobId],
    review: reviews[jobId],
    });

if (!ratings[jobId]) {
  alert("Please select a rating.");
  return;
}

    await api.post(`/jobs/${jobId}/rate`, {
      stars: ratings[jobId],
      review: reviews[jobId] || "",
    });

    alert("Rating submitted successfully.");
    await refreshJobs();

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.error ||
      "Failed to submit rating."
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Current Work
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">
          No current work.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow rounded-xl p-5 border"
            >
              <h2 className="text-lg font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {job.description}
              </p>

              <p className="mt-3 font-medium">
                Budget: ₹{job.budget}
              </p>
                {user?.user_type === "client" &&
                job.status === "completed" && 
                !job.already_rated && (
             
          <div className="mt-5">

          <p className="font-semibold mb-2">
            Rate this Talent
           </p>

    <select
      id={`rating-${job.id}`}
      name={`rating-${job.id}`}
      className="border rounded-lg w-full p-2"
      value={ratings[job.id] || ""}
      onChange={(e) =>
        setRatings((prev)=>({
          ...prev,
          [job.id]: Number(e.target.value),
        }))
      }
    >
      <option value="">Select Rating</option>
      <option value="5">★★★★★</option>
      <option value="4">★★★★☆</option>
      <option value="3">★★★☆☆</option>
      <option value="2">★★☆☆☆</option>
      <option value="1">★☆☆☆☆</option>
    </select>

    <textarea
      className="mt-3 border rounded-lg w-full p-3"
      rows={3}
      placeholder="Write a review..."
      value={reviews[job.id] || ""}
      onChange={(e) =>
        setReviews({
          ...reviews,
          [job.id]: e.target.value,
        })
      }
    />

    <button
      onClick={() => submitRating(job.id)}
      disabled={submitting}
      className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
    >
      Submit Rating
    </button>

  </div>
)}
              <p className="text-sm text-green-600 mt-2">
                Status: {job.status}
              </p>
              {user?.user_type === "client" && job.status === "accepted" && (
        <button
            onClick={() => completeJob(job.id)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Mark as Completed
         </button>
       )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}