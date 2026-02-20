import { useState } from "react";
import { contentService } from "../../services/contentService";

export default function UploadForm({ onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category) return alert("Jaza title na category!");

    setLoading(true);
    try {
      await contentService.createContent({ title, category });
      setTitle("");
      setCategory("");
      onUploadSuccess();
      alert("Maudhui yamefanikiwa kupakiwa!");
    } catch (error) {
      console.error(error);
      alert("Tatizo katika kupakia maudhui.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-md">
      <div>
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Andika title ya maudhui" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Category</label>
        <input 
          type="text" 
          value={category} 
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Andika category" 
        />
      </div>
      <button 
        type="submit" 
        className={`w-full py-2 rounded-lg font-medium text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        disabled={loading}
      >
        {loading ? "Inapakia..." : "Pakua Maudhui"}
      </button>
    </form>
  );
}
