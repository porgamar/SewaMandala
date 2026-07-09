export default function Talent_list() {
  return (
    <div className="min-h-screen p-8 ">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Talent Profile</h1>
          <p className="text-gray-600">
            Showcase your skills and let clients find you.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">
              Profile Image
            </label>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 border rounded-md bg-white flex items-center justify-center">
                <span className="text-gray-400">Preview</span>
              </div>

              <label className="cursor-pointer">
                <div className="border rounded-md px-4 py-2 bg-white hover:bg-gray-100">
                  Upload Image
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Jordan Ellis"
              className="w-full border rounded-md p-3 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Title
            </label>

            <input
              type="text"
              placeholder="Frontend Developer"
              className="w-full border rounded-md p-3 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Bio
            </label>

            <textarea
              rows="5"
              placeholder="A couple of sentences about how you work."
              className="w-full border rounded-md p-3 bg-white resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                <select >
                <option>Hourly</option>
                <option>work based</option>
              
              </select>
              </label>

              <input
                type="number"
                placeholder="60"
                className="w-full border rounded-md p-3 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Availability
              </label>

              <select className="w-full border rounded-md p-3 bg-white">
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

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill and press Enter"
                className="flex-1 border rounded-md p-3 bg-white"
              />

              <button
                type="button"
                className="border rounded-md px-5 bg-white hover:bg-gray-100 text-xl"
              >
                +
              </button>
            </div>

            <p className="text-gray-500 mt-2">
              No skills added yet.
            </p>
          </div>

          <button
            type="button"
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md"
          >
            ✓ Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}