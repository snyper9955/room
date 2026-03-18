import React, { useState, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";

const RoomForm = ({ onSubmit, initialData, onClose }) => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    price: "",
    type: "Single",
    amenities: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        roomNumber: initialData.roomNumber || "",
        price: initialData.price || "",
        type: initialData.type || "Single",
        amenities: initialData.amenities?.join(", ") || "",
        description: initialData.description || "",
      });
      setPreview(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(filePreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("roomNumber", formData.roomNumber);
    data.append("price", formData.price);
    data.append("type", formData.type);
    data.append("description", formData.description);
    
    // Split amenities by comma and trim
    const amenitiesArray = formData.amenities.split(",").map((a) => a.trim());
    amenitiesArray.forEach((amenity) => data.append("amenities", amenity));

    images.forEach((image) => {
      data.append("images", image);
    });

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit Room" : "Add New Room"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="e.g. 101"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Price (₹ / month)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Room Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Amenities (comma separated)</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="WiFi, AC, Geyser"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Describe the room..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Room Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl hover:border-slate-500 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-400">
                  <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                    Upload icons
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          {preview.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {preview.map((src, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden h-20 shadow-lg">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {initialData ? "Update Room" : "Save Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
