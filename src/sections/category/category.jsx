import { CloudUpload } from "lucide-react";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addCategory, updateCategory } from "../../services/category/category";

const AddCategory = () => {
  const [categoryData, setCategoryData] = useState({
    category_image: "",
    category_name: "",
    status: true,
  });
  

  const location = useLocation();
  const isEdit = location?.state?._id;
  const state = location?.state;

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (key, value) => {
    setCategoryData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setCategoryData({ ...categoryData, category_image: file });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setCategoryData(() => ({
        category_name: state?.category_name,
        status: state?.status,
        category_image: state?.category_image,
      }));
      setSelectedImage(state?.category_image);
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData?.category_name) {
      enqueueSnackbar("category name is required", { variant: "error" });
      return;
    }

    if (!categoryData?.category_image) {
      enqueueSnackbar("category images is required", { variant: "error" });
      return;
    }
    try {
      const formData = new FormData();

      formData.append("category_name", categoryData?.category_name);

      formData.append("category_image", categoryData?.category_image);

      if (!isEdit) {
        const res = await addCategory(formData);
        if (res) {
          enqueueSnackbar("Category add Successfully", { variant: "success" });
          navigate("/categoryPage");
        }
      } else {
        formData.append("status", categoryData?.status);
        const res = await updateCategory(formData, isEdit);
        if (res) {
          enqueueSnackbar("Category update Successfully", {
            variant: "success",
          });
          navigate("/categoryPage");
        }
      }
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  return (
    <div className="flex justify-center items-start mt-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isEdit ? "Update Category" : "  Add Category"}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Upload Field */}
          <div className="mb-6">
            <label
              htmlFor="category_image"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Upload Category Image
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-all">
              <input
                type="file"
                id="category_image"
                name="category_image"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
              />
              <CloudUpload className="mx-auto text-green-500 w-8 h-8 mb-2" />
              <p className="text-sm text-gray-500">Click to upload</p>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="mt-4 mx-auto w-24 h-24 object-cover rounded-md border"
                />
              )}
            </div>
          </div>

          {/* Category Name */}
          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              type="text"
              id="category_name"
              name="category_name"
              value={categoryData?.category_name}
              onChange={(e) =>
                handleInputChange("category_name", e.target.value)
              }
              className="w-full bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter category name"
              required
            />
          </div>
          {isEdit && (
            <div className="mb-6">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div className="flex">
                <div className="flex items-center me-4">
                  <input
                    id="status-active"
                    type="radio"
                    value="true"
                    name="status"
                    checked={categoryData?.status === true}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value === "true")
                    }
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor="status-active"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Active
                  </label>
                </div>
                <div className="flex items-center me-4">
                  <input
                    id="status-inactive"
                    type="radio"
                    value="false"
                    name="status"
                    checked={categoryData?.status === false}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value === "true")
                    }
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor="status-inactive"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Inactive
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-300 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
          >
            {isEdit ? "Update Category" : "  Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
