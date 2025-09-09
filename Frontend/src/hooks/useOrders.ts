import { useState, useEffect, useCallback } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder, Order } from "../services/api";

export const useOrders = (paymentStatusFilter: string = "all", orderIdSearchTerm: string = "") => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getOrders = useCallback(async () => {
    try {
      const data = await fetchOrders(paymentStatusFilter, orderIdSearchTerm);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [paymentStatusFilter, orderIdSearchTerm]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const updateOrder = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      let alertMessage = `Order ${orderId} status updated to ${status} successfully!`;
      if (updatedOrder.emailSent !== undefined) {
        alertMessage += updatedOrder.emailSent ? " Email notification sent." : " Failed to send email notification.";
      }
      alert(alertMessage);
    } catch (err: any) {
      setError(err.message);
      alert(`Failed to update order ${orderId} status: ${err.message}. Email notification not sent.`);
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      const response = await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      let alertMessage = `Order ${orderId} deleted successfully!`;
      if (response.emailSent !== undefined) {
        alertMessage += response.emailSent ? " Cancellation email sent." : " Failed to send cancellation email.";
      }
      alert(alertMessage);
    } catch (err: any) {
      setError(err.message);
      alert(`Failed to delete order ${orderId}: ${err.message}. Cancellation email not sent.`);
    }
  };

  return { orders, loading, error, updateOrder, removeOrder };
};
