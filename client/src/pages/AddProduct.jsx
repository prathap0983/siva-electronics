import { useState } from "react";
import { PlusCircle, Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../api/api";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({
        ...form,
        image: e.target.files[0]
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    if (!form.image) {
      setErrorMsg("Please select an image file first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("image", form.image);

    try {
      const res = await API.post("/products/add", data);
      console.log(res.data);
      setSuccess(true);
      alert("Product Added successfully!");
      // Reset form
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null
      });
      // Reset file input element
      const fileInput = document.getElementById("image-file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark py-12 px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-550 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-950 dark:text-white">Add New Product</h1>
              <p className="text-xs text-slate-500">Post a new smart TV or mobile device to your store.</p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded-2xl text-xs font-semibold border border-red-100 dark:border-red-900/50">
              {errorMsg}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-2xl text-xs font-semibold border border-green-100 dark:border-green-900/50">
              Product uploaded and saved to Supabase successfully!
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitProduct} className="space-y-5">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Product Name *</label>
              <input
                required
                type="text"
                name="name"
                value={form.name}
                placeholder="e.g. Vivo V60"
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Category *</label>
              <input
                required
                type="text"
                name="category"
                value={form.category}
                placeholder="e.g. Mobile, Smart TV, LED TV"
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Price (INR) *</label>
              <input
                required
                type="number"
                name="price"
                value={form.price}
                placeholder="e.g. 35000"
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Description *</label>
              <textarea
                required
                name="description"
                value={form.description}
                placeholder="Provide smartphone/TV specifications and display attributes..."
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Product Image *</label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary transition-colors rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-slate-800">
                <input
                  required
                  id="image-file-input"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-1 text-slate-500">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-655 dark:text-slate-350">
                    {form.image ? `Selected: ${form.image.name}` : "Click to select a product image"}
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, or WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full mt-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all active:scale-98 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span>Uploading to Cloudinary & Supabase...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product</span>
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default AddProduct;
