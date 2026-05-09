import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";

const ImageUpload = ({ formData, setFormData }) => {

  // ✅ handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData({
      ...formData,
      productImg: [...(formData.productImg || []), ...files]
    });
  };

  // ✅ remove image
  const handleRemove = (index) => {
    const updatedImages = formData.productImg.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      productImg: updatedImages
    });
  };

  return (
    <div className="mt-3">
      <label className="block mb-2 font-medium">Product Images</label>

      {/* Hidden Input */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      {/* Upload Button */}
      <label
        htmlFor="file-upload"
        className="border border-[var(--color-border-primary)] px-3 py-2 cursor-pointer inline-block bg-[var(--color-background)] hover:bg-[var(--color-primary)]/10 w-full items-center rounded transition-colors"
      >
        Upload Images
      </label>

      {/* Preview Section */}
      {formData.productImg && formData.productImg.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">

          {formData.productImg.map((file, index) => {
            let preview = "";

            // ✅ correct file check
            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <div
                key={index}
                className="relative bg-gray-50 p-2 rounded"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-md"
                />

                {/* ❌ Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-100"
                >
                  <RiDeleteBin6Line className="text-red-500" />
                </button>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default ImageUpload;