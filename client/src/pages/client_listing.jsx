export default function Client_list(){
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
      <label className="block font-semibold mb-2">
        Image
      </label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-white bor5der rounded-md flex items-center justify-center">
          <span className="text-gray-400">preview</span>
        </div>
        <label className="cursor-pointer">
          <div className="bg-white border px-4 py-2 rounded-md">upload image</div>
          <input type="file" className="hidden"/>
        </label>
      </div>
     </div>

     <div>
      <label className="block font -semibold mb-2">Title:</label>
      <input type="text" placeholder="My skin is broken"
      className="w-full border rounded-md p-3 bg-white"
      />
     </div>
     <div>
      <label>Type of Job</label>
      <select className="w-full border rounded-md p-3 bg-white">
        <option>Plumbing</option>
        <option>cleaning</option>
        <option>Repair</option>
        <option>Others</option>
      </select>
     </div>

     <div>
      <label className="block font-semibold mb-2">
        Budget / Rate:
      </label>
      <input
         type="number" placeholder="$50" className="w-full border rounded-md p-3 bg-white"/>
     </div>

     <div>
      <label className="block font-semibold mb-2">
        Description:
      </label>

      <textarea
       rows="5" placeholder="Explain what service you need... "className="w-full border rounded-md p-3 bg-white resize-none"/>
     </div>

      <button type="button" className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800">
        Post
      </button>

    </form>
   </div>

  </div>
</div>
)
}