import React from "react";
import { Star } from "lucide-react";

const ProductCard = ({
  image,
  discount,
  rating,
  reviews,
  title,
  price,
  originalPrice,
  tags,
  colors,
  sizes,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 max-w-xs">
      <div className="relative">
        <img src={image} alt={title} className="rounded-xl w-full h-56 object-cover" />
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
          {discount}% OFF
        </span>
        <span className="absolute top-2 right-2 bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
          SHARK TANK
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center text-sm text-yellow-600 font-medium">
          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1" />
          {rating} | {reviews}
        </div>

        <h3 className="text-base font-semibold mt-2">{title}</h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-green-700">₹{price}</span>
          <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
        </div>

        <div className="flex gap-2 mt-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm">
          <div className="mb-1 font-medium">Select Size</div>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className="border rounded-full px-2 py-1 text-sm hover:bg-gray-200"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="mb-1 font-medium">Select Color</div>
          <div className="flex gap-2">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full border-2`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <button className="mt-6 w-full bg-emerald-900 text-white py-2 rounded-xl hover:bg-emerald-800 transition">
          Add to Basket
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
