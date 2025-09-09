import { useState, useEffect, useCallback } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder, Order } from "../services/api";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getOrders = useCallback(async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const updateOrder = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      alert(`Order ${orderId} status updated to ${status} successfully!`);
    } catch (err: any) {
      setError(err.message);
      alert(`Failed to update order ${orderId} status: ${err.message}`);
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { orders, loading, error, updateOrder, removeOrder };
};
