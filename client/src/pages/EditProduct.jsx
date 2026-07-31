import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Edit3, Upload, ArrowLeft, Loader2 } from "lucide-react";
import API from "../api/api";
import { useToast } from "../context/ToastContext.jsx";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });
  
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing product data
  useEffect(() => {
    setFetching(true);
    API.get(`/products/${id}`)
      .then((res) => {
        const prod = res.data;
        setForm({
          name: prod.name || "",
          description: prod.description || "",
          price: prod.price || "",
          category: prod.category || "",
          image: null
        });
        setExistingImageUrl(prod.image_url || "");
      })
      .catch((err) => {
        console.error(err);
        addToast("Failed to load product details.", "error");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [id]);

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
    setSubmitting(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("existing_image_url", existingImageUrl);
    
    if (form.image) {
      data.append("image", form.image);
    }

    try {
      const res = await API.put(`/products/${id}`, data);
      console.log("Updated response:", res.data);
      addToast("Product Updated Successfully!", "success");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || "Upload Failed or Update failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-semibold text-slate-400">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark py-12 px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/admin/products" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-950 dark:text-white">Edit Product</h1>
              <p className="text-xs text-slate-500">Update specifications or replacement images in your catalog.</p>
            </div>
          </div>

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
              <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wider block">Category *</label>
              <input
                required
                type="text"
                name="category"
                value={form.category}
                placeholder="e.g. Mobile, Smart TV"
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wider block">Price (INR) *</label>
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
              <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wider block">Description *</label>
              <textarea
                required
                name="description"
                value={form.description}
                placeholder="Provide specs details..."
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Current Image Preview */}
            {existingImageUrl && !form.image && (
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-455 uppercase block">Current Product Image</label>
                <div className="h-28 w-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={existingImageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-455 uppercase block">Replace Product Image</label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary transition-colors rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-slate-800">
                <input
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
                    {form.image ? `Selected: ${form.image.name}` : "Click to select replacement image file"}
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, or WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={submitting}
              className="w-full mt-2 bg-primary hover:bg-primary-hover text-slate-950 py-3.5 rounded-xl font-bold transition-all active:scale-98 shadow-md disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudinary & Supabase...</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Update Product</span>
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default EditProduct;
