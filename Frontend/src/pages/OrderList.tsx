import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../services/api";
import { Eye } from "lucide-react"; // Import Eye icon
import Modal from "../components/Modal"; // Assuming a Modal component exists

const OrderList: React.FC = () => {
  const { orders, loading, error, updateOrder, removeOrder } = useOrders();
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
    "pending",
    "payment-done",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount (₹)</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ordered At</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-5 text-sm text-gray-900">{order._id}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">{order.user?.name || "N/A"}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">{order.user?.phoneNumber || "N/A"}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.product._id}>
                          {item.product.name} ({item.quantity} x ₹{item.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">
                    <select
                      value={pendingStatus[order._id] || order.status}
                      onChange={(e) => handleLocalStatusChange(order._id, e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-5 text-sm text-gray-900 flex items-center space-x-2">
                    <button
                      onClick={() => handleConfirmStatus(order._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                      disabled={pendingStatus[order._id] === order.status}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrder && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-2">
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.user?.name || "N/A"}</p>
            <p><strong>Customer Email:</strong> {selectedOrder.user?.email || "N/A"}</p>
            <p><strong>Phone Number:</strong> {selectedOrder.user?.phoneNumber || "N/A"}</p>
            <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).replace('-', ' ')}</p>
            <p><strong>Ordered At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
            <ul className="list-disc list-inside ml-4">
              {selectedOrder.items.map((item) => (
                <li key={item.product._id}>
                  {item.product.name} ({item.quantity} x ₹{item.price.toFixed(2)}) - Subtotal: ₹{(item.quantity * item.price).toFixed(2)}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Address:</h3>
            <p>{selectedOrder.shippingAddress.street}</p>
            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}</p>
            <p>{selectedOrder.shippingAddress.country}</p>
            <p>WhatsApp: {selectedOrder.shippingAddress.whatsappNumber}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderList;
