import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye, Search, X } from "lucide-react";
import type { Product } from "../types";
import AddProductForm from "./AddProductForm";

export interface InventoryManagementProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
  onProductDelete: (productId: string) => void;
  fetchProducts: () => void;
}

export default function InventoryManagement({
  products,
  onProductUpdate,
  onProductDelete,
  fetchProducts
}: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.fabricType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.regionalVarieties
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || product.productType === filterType;
    const matchesAvailability =
      filterAvailability === "all" ||
      product.availability === filterAvailability;

    return matchesSearch && matchesType && matchesAvailability;
  });

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete product");
        }

        onProductDelete(productId);
        alert("Product deleted successfully");
        window.location.reload();
      } catch (err: any) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  const handleProductUpdate = (product: Product) => {
    onProductUpdate(product);
    setEditingProduct(null);
  };

  if (editingProduct) {
    return (
      <AddProductForm
        editProduct={editingProduct}
        onCancel={() => setEditingProduct(null)}
        onProductAdded={handleProductUpdate}
      />
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h2>
        <div className="text-sm text-gray-600">
          Total Products: {products.length}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Types</option>
          <option value="saree">Saree</option>
          <option value="suits">Suits</option>
          <option value="boutique-fabrics">Boutique Fabrics</option>
          <option value="accessories">Accessories</option>
        </select>

        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Limited">Limited</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Fabric Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Regional Varieties
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Discounts
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Availability
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    {product.images[0] && (
                      <img
                        src={
                          `${import.meta.env.VITE_API_URL}${
                            product.images[0]
                          }` || "/placeholder.svg"
                        }
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {product.productType}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {product.fabricType}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {product.regionalVarieties}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  ₹{product.price}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {product.discounts}%
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.availability === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : product.availability === "Limited"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.availability}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {product.quantity}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {viewingProduct.name}
              </h3>
              <button
                onClick={() => setViewingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {viewingProduct.images.map((image) => (
                    <img
                      key={image}
                      src={
                        `${import.meta.env.VITE_API_URL}${image}` ||
                        "/placeholder.svg"
                      }
                      alt={viewingProduct.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Fabric Type</h4>
                  <p className="text-gray-900">{viewingProduct.fabricType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">
                    Regional Varieties
                  </h4>
                  <p className="text-gray-900">
                    {viewingProduct.regionalVarieties}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Price</h4>
                  <p className="text-gray-900">₹{viewingProduct.price}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Discount</h4>
                  <p className="text-gray-900">{viewingProduct.discounts}%</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Sizes</h4>
                  <div className="flex flex-wrap gap-1">
                    {viewingProduct.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Availability</h4>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingProduct.availability === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : viewingProduct.availability === "Limited"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewingProduct.availability}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="text-gray-900">
                    {viewingProduct.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
