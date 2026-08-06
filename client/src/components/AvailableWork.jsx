import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext"; 

export default function AvailableWork() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // 1. Keep data fetching scoped tightly inside useEffect
  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        const { data } = await api.get("/jobs");
        if (isMounted) {
          setJobs(data);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadJobs();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, []); // Run ONCE on mount

  // 2. acceptWork directly updates local state (No re-fetching needed)
  const acceptWork = async (jobId) => {
    try {
      await api.patch(`/jobs/${jobId}/accept`);

      // Optimistic update: remove the accepted job from state instantly
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));

      alert("Work accepted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to accept work.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading available work...</p>
      </div>
    );
  }

  if (user?.user_type === "client") {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Access Denied
        </h2>

        <p className="text-gray-600">
          Clients cannot access the Available Work page.
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Available Work</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No work available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img
                  src={`http://localhost:5000/uploads/${job.image}`}
                  alt={job.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                  <p className="text-gray-500 mt-1">Posted by {job.full_name}</p>
                  <p className="mt-4"><strong>Category:</strong> {job.job_type}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Budget:</strong> Rs. {job.budget}</p>
                  <p className="mt-4 text-gray-700">{job.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => acceptWork(job.id)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  Accept Work
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}