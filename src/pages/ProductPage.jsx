import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { fetchAllProducts } from "../services/product/products";

const ProductPage = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetchAllProducts(page, limit);
        setProductList(res?.data || []);
        setTotalPages(res?.totalPages || 0);
        setTotalRecords(res?.totalProducts || 0);
      } catch (error) {
        enqueueSnackbar(error?.message || "Failed to fetch products", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  const handleAdd = () => navigate("/products/add");

  const handleEdit = (item) =>
    navigate(`/products/edit/${item?._id}`, { state: item });

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white text-[16px] font-semibold px-3 py-1 rounded transition"
        >
          ADD
        </button>
      </div>

      {loading ? (
        <h2 className="text-lg font-medium">Loading...</h2>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-green-200 text-left text-gray-700">
              <tr>
                {[
                  "SL.no",
                  "Product Image",
                  "Product Name",
                  "Rating",
                  "Price",
                  "Offer Price",
                  "Category",
                  "Color Options",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="py-3 px-4">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productList.map((item, index) => {
                const {
                  product_images,
                  product_name,
                  rating,
                  currect_price,
                  offer_price,
                  category,
                  color_options,
                  inStock,
                } = item;

                return (
                  <tr
                    key={item?._id || index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={product_images?.[0]?.image_link}
                        alt={product_name || "Product"}
                        className="w-12 h-12 object-cover rounded-full shadow"
                      />
                    </td>
                    <td className="py-3 px-4">{product_name}</td>
                    <td className="py-3 px-4">{rating}</td>
                    <td className="py-3 px-4">{currect_price}</td>
                    <td className="py-3 px-4">{offer_price}</td>
                    <td className="py-3 px-4">{category?.category_name}</td>
                    <td className="py-3 px-4">{color_options?.join(", ")}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inStock ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ul className="flex justify-center gap-3 text-gray-900 mt-[10px]">
            <li>
              <button
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
                className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors 
        ${
          page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
        } rtl:rotate-180`}
                aria-label="Previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>

            <li className="text-sm/8 font-medium tracking-widest">
              {page}/{totalPages}
            </li>

            <li>
              <button
                onClick={() => page < totalPages && setPage(page + 1)}
                disabled={page === totalPages}
                className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors 
        ${
          page === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-50"
        } rtl:rotate-180`}
                aria-label="Next page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
