import { Check, CloudUpload, X } from "lucide-react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { fetchAllCategory } from "../../services/category/category";
import { addProducts, updateProducts } from "../../services/product/products";
import { useLocation, useNavigate } from "react-router-dom";
const AddProducts = () => {
  const [productData, setProductData] = useState({
    product_name: "",
    product_images: [],
    rating: 0,
    currect_price: 0,
    offer_price: 0,
    category: "",
    description: "",
    color_options: [],
    inStock: true,
  });
  const location = useLocation();
  const { state } = location;
  const isEdit = state?._id ? true : false;

  const [selectedImages, setSelectedImages] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const handleInputChange = (key, value) => {
    setProductData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (isEdit) {
      setProductData({
        product_name: state?.product_name || "",
        product_images: state?.product_images || [],
        rating: state?.rating || 0,
        currect_price: state?.currect_price || 0,
        offer_price: state?.offer_price || 0,
        category: state?.category?._id || "",
        description: state?.description || "",
        color_options: state?.color_options || [],
        inStock: state?.inStock || true,
      });
      setSelectedImages(
        state?.product_images?.map((image) => ({
          preview: image?.image_link,
        })) || []
      );
    }
  }, [isEdit]);

  const handleMultiImages = (e) => {
    const files = Array.from(e.target.files);
    const total = files?.length + selectedImages?.length;

    if (total > 5) {
      enqueueSnackbar("only 5 images are upload", { variant: "error" });
      return;
    }
    const newImages = files?.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
      name: file?.name,
      type: file?.type,
    }));

    const uploadImages = [...selectedImages, ...newImages];
    setSelectedImages(uploadImages);
    setProductData((prev) => ({
      ...prev,
      product_images: uploadImages?.map((it) => it.file || it.preview),
    }));
  };

  const handleRemoveImages = (index) => {
    const uploadImages = [...selectedImages];
    uploadImages.splice(index, 1);
    setSelectedImages(uploadImages);
    setProductData((prev) => ({
      ...prev,
      product_images: uploadImages?.map((it) => it?.file || it?.preview),
    }));
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetchAllCategory();
        setCategoryList(res?.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const colorList = [
    { value: "orange", label: "Orange" },
    { value: "green", label: "Green" },
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      enqueueSnackbar("Please upload at least one image", { variant: "error" });
      return;
    }
    if (productData?.product_name === "") {
      enqueueSnackbar("Please enter product name", { variant: "error" });
      return;
    }
    if (productData?.category === "") {
      enqueueSnackbar("Please select a category", { variant: "error" });
      return;
    }
    if (productData?.rating < 1 || productData?.rating > 5) {
      enqueueSnackbar("Rating must be between 1 and 5", { variant: "error" });
      return;
    }
    if (productData?.currect_price <= 0) {
      enqueueSnackbar("Current price must be greater than 0", {
        variant: "error",
      });
      return;
    }
    if (productData?.offer_price <= 0) {
      enqueueSnackbar("Offer price must be greater than 0", {
        variant: "error",
      });
      return;
    }
    if (productData?.description === "") {
      enqueueSnackbar("Please enter product description", { variant: "error" });
      return;
    }
    if (productData?.color_options.length === 0) {
      enqueueSnackbar("Please select at least one color option", {
        variant: "error",
      });
      return;
    }
    if (productData?.offer_price >= productData?.currect_price) {
      enqueueSnackbar("Offer price must be less than current price", {
        variant: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_name", productData?.product_name);
      formData.append("rating", productData?.rating);
      formData.append("currect_price", productData?.currect_price);
      formData.append("offer_price", productData?.offer_price);
      formData.append("description", productData?.description);
      formData.append("category", productData?.category);
      productData?.color_options?.forEach((color) => {
        formData.append("color_options", color);
      });

      selectedImages.forEach((image) => {
        if (image?.file) {
          formData.append("product_images", image?.file);
        } else {
          formData.append("product_images", image?.preview);
        }
      });

      if (isEdit) {
        formData.append("inStock", productData?.inStock);
        const res = await updateProducts(formData, state._id);
        if (res) {
          enqueueSnackbar("Product updated successfully", {
            variant: "success",
          });
          navigate("/products");
        }
      } else {
        const res = await addProducts(formData);
        if (res) {
          enqueueSnackbar("Product added successfully", { variant: "success" });
          navigate("/products");
        }
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Something went wrong", {
        variant: "error",
      });
      return;
    }
  };

  return (
    <div className="flex  justify-center items-start mt-10 px-4">
      <div className="w-full   bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isEdit ? "Update Product" : "Add Product"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label
              htmlFor="category_image"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Upload Product Image
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-all">
              <input
                type="file"
                id="product_images"
                name="product_images"
                accept="image/*"
                onChange={handleMultiImages}
                className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
              />
              <CloudUpload className="mx-auto text-green-500 w-8 h-8 mb-2" />
              <p className="text-sm text-gray-500">Click to upload</p>

              <div className="grid grid-cols-5 gap-4">
                {selectedImages.map((media, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-24 border rounded overflow-hidden"
                  >
                    <img
                      src={media.preview}
                      alt={media.name}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImages(index)}
                      className="absolute top-0 right-0 bg-white rounded-bl px-1"
                    >
                      <X className="h-4 w-4 text-red-500 cursor-pointer" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={productData?.product_name || ""}
              onChange={(e) =>
                handleInputChange("product_name", e.target.value)
              }
              className="w-full bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Product Rating out of 5
            </label>
            <input
              type="Number"
              id="rating"
              name="rating"
              value={productData?.rating}
              onChange={(e) => {
                let input = parseFloat(e.target.value);
                if (input > 5) input = 5;
                if (input < 1) input = 1;
                handleInputChange("rating", input);
              }}
              max={5}
              min={1}
              step={0.1}
              required
              className="w-full bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter product Rating"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Product Price
            </label>
            <input
              type="Number"
              id="currect_price"
              name="currect_price"
              value={productData?.currect_price}
              onChange={(e) => {
                let input = parseInt(e.target.value);
                handleInputChange("currect_price", input);
              }}
              required
              className="w-full bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter product Price"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Product offer Price
            </label>
            <input
              type="Number"
              id="offer_price"
              name="offer_price"
              value={productData?.offer_price}
              onChange={(e) => {
                let input = parseInt(e.target.value);
                handleInputChange("offer_price", input);
              }}
              required
              className="w-full bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter product offer Price"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Product Description
            </label>
            <textarea
              id="description"
              rows="4"
              value={productData?.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              htmlFor="category_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Choose Product Category
            </label>
            <select
              id="countries"
              value={productData?.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            >
              <option selected>Choose a category</option>
              {categoryList?.map((category, index) => {
                return (
                  <option key={index} value={category?._id}>
                    {category?.category_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Choose Product Colors
            </label>
            <div className="  flex gap-3">
              {colorList?.map((color) => (
                <div key={color.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`color-${color.value}`}
                    checked={productData?.color_options.includes(color.value)}
                    onChange={(e) => {
                      const currentColors = productData?.color_options || [];
                      const isChecked = e.target.checked
                        ? [...currentColors, color.value]
                        : currentColors.filter((c) => c !== color.value);
                      handleInputChange("color_options", isChecked);
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ms-2 text-sm font-medium text-gray-900">
                    {color.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2.5 rounded-lg font-medium hover:bg-green-900 transition"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
