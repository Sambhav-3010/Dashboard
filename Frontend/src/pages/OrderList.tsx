import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../services/api";
import { Eye } from "lucide-react"; // Import Eye icon
import Modal from "../components/Modal"; // Assuming a Modal component exists
import { motion } from "framer-motion"; // Import motion

const OrderList: React.FC = () => {
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [orderIdSearchTerm, setOrderIdSearchTerm] = useState<string>("");
  const { orders, loading, error, updateOrder, removeOrder } = useOrders(paymentStatusFilter, orderIdSearchTerm);
  const [pendingStatus, setPendingStatus] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Initialize pendingStatus when orders load or change
  React.useEffect(() => {
    const initialPendingStatus: { [key: string]: string } = {};
    orders.forEach(order => {
      initialPendingStatus[order._id] = order.status;
    });
    setPendingStatus(initialPendingStatus);
  }, [orders]);

  const handleLocalStatusChange = (orderId: string, newStatus: string) => {
    setPendingStatus(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleConfirmStatus = async (orderId: string) => {
    const statusToUpdate = pendingStatus[orderId];
    if (statusToUpdate) {
      await updateOrder(orderId, statusToUpdate);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await removeOrder(orderId);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) return <div className="text-center text-lg mt-8">Loading orders...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-8">Error: {error}</div>;

  const orderStatusOptions = [
    "all",
    "pending",
    "payment-done",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {orderStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, Customer Number..."
          value={orderIdSearchTerm}
          onChange={(e) => setOrderIdSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 flex-grow"
        />
      </div>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Amount (₹)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ordered At</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-4 py-4 text-sm text-gray-700">{order._id}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{order.user?.phoneNumber || "N/A"}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.product._id}>
                          {item.product.name} ({item.quantity} x ₹{item.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 text-center">
                    <select
                      value={pendingStatus[order._id] || order.status}
                      onChange={(e) => handleLocalStatusChange(order._id, e.target.value)}
                      className="block mx-auto pl-4 pr-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm max-w-[150px]"
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 flex items-center space-x-2">
                    <button
                      onClick={() => handleConfirmStatus(order._id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors"
                      disabled={pendingStatus[order._id] === order.status}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrder && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Order ID:</strong> <span className="font-medium text-gray-900">{selectedOrder._id}</span></p>
            <p><strong>Customer Name:</strong> <span className="font-medium text-gray-900">{selectedOrder.user?.name || "N/A"}</span></p>
            <p><strong>Customer Email:</strong> <span className="font-medium text-gray-900">{selectedOrder.user?.email || "N/A"}</span></p>
            <p><strong>Phone Number:</strong> <span className="font-medium text-gray-900">{selectedOrder.user?.phoneNumber || "N/A"}</span></p>
            <p><strong>Total Amount:</strong> <span className="font-medium text-gray-900">₹{selectedOrder.totalAmount.toFixed(2)}</span></p>
            <p><strong>Status:</strong> <span className="font-medium text-gray-900">{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).replace('-', ' ')}</span></p>
            <p><strong>Ordered At:</strong> <span className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Items:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {selectedOrder.items.map((item) => (
                <li key={item.product._id} className="text-gray-700">
                  <span className="font-medium">{item.product.name}</span> ({item.quantity} x ₹{item.price.toFixed(2)}) - Subtotal: <span className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Shipping Address:</h3>
            <div className="space-y-1">
              <p className="text-gray-700">{selectedOrder.shippingAddress.street}</p>
              <p className="text-gray-700">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}</p>
              <p className="text-gray-700">{selectedOrder.shippingAddress.country}</p>
              <p className="text-gray-700">WhatsApp: <span className="font-medium text-gray-900">{selectedOrder.shippingAddress.whatsappNumber}</span></p>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default OrderList;
