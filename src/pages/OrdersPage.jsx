import React, { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../services/orders/orders";
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  User2,
  MapPin,
  X,
  PackageCheck,
  Truck,
  CheckCircle,
  Ban,
} from "lucide-react";
import { useSnackbar } from "notistack";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("Processing");
  const [newPaymentStatus, setNewPaymentStatus] = useState("Pending");
  const [user,setUser]= useState("");

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setUser(order.userId._id)
    setModelOpen(true);
  };
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchAllOrders();
        setOrders(res?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error?.message);
      }
    };
    fetchOrders();
  }, [modelOpen]);

  const statusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <PackageCheck className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <Ban className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleOrderStatusUpdate = async () => {
    try {
      let data = {
        orderStatus: newStatus,
        orderId: selectedOrder?._id,
        userId: user,
      };

      if (selectedOrder.paymentMethod === "COD") {
        data.paymentStatus = newPaymentStatus;
      }
      const res = await updateOrderStatus(data);
      if (res) {
        setModelOpen(false);
        enqueueSnackbar("order status updated successfully", {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-2xl p-6 bg-white shadow hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="flex justify-between mb-4 text-sm text-gray-500">
                <div>
                  <p>
                    Order ID:{" "}
                    <span className="text-gray-700 font-medium">
                      {order?._id}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {["Processing", "Shipped"].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleStatusUpdate(order)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
                    >
                      Update Order Status
                    </button>
                  )}
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={item.product?.product_images[0]?.image_link}
                      alt={item.product?.product_name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.product?.product_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-green-700 font-semibold flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {item.product?.offer_price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address & Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Address */}
                <div className="bg-gray-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium">
                    <User2 className="w-4 h-4" /> Shipping Info
                  </div>
                  <p className="text-sm text-gray-700">
                    {order.address.firstName} <br />
                    <MapPin className="inline-block w-4 h-4 mr-1 text-gray-500" />
                    {order.address.streetAddress}, {order.address.city},{" "}
                    {order.address.state} <br />
                    {order.address.country} - {order.address.pinCode}
                  </p>
                </div>

                {/* Payment & Status */}
                <div className="bg-gray-100 p-4 rounded-xl space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="flex items-center gap-1 font-bold text-green-700">
                      <IndianRupee className="w-4 h-4" />
                      {order.totalAmount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span>
                      {order.paymentMethod}{" "}
                      <span
                        className={`ml-2 font-semibold ${
                          order.paymentStatus === "Pending"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <span
                      className={`flex items-center gap-2 font-semibold ${
                        order.orderStatus === "Processing"
                          ? "text-yellow-600"
                          : "text-green-700"
                      }`}
                    >
                      {order.orderStatus === "Processing" ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modelOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 animate-fade-in-down">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-green-600" />
                Update Order Status
              </h2>
              <button
                onClick={() => setModelOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order ID:</span>{" "}
                <span className="text-gray-800">{selectedOrder?._id}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Current Status:</span>{" "}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md text-gray-800 text-xs font-medium">
                  {statusIcon(selectedOrder?.orderStatus)}
                  {selectedOrder?.orderStatus}
                </span>
              </p>
            </div>

            {selectedOrder.paymentMethod === "COD" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            )}

            {/* Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Step Indicator (Visual Status Hint) */}
            <div className="flex items-center justify-between text-sm mb-6">
              {["Processing", "Shipped", "Delivered", "Cancelled"].map(
                (step) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center w-full ${
                      step === newStatus
                        ? "text-green-600 font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {statusIcon(step)}
                    <span className="mt-1">{step}</span>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModelOpen(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleOrderStatusUpdate}
                className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
