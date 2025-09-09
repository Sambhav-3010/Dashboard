const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  addresses?: any[];
  wishlist?: any[];
  createdAt: string;
}

interface ProductItem {
  product: { _id: string; name: string; price: number };
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  whatsappNumber: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string; phoneNumber?: string }; // Added phoneNumber
  items: ProductItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: string;
  createdAt: string;
  emailSent?: boolean; // Add this line
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update order status");
  }
  return response.json();
};

export const deleteOrder = async (orderId: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete order");
  }
  return response.json();
};
