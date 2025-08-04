
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, X, Plus, Save } from "lucide-react"
import type { Product } from "../types"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  fabricType: z.string().min(1, "Fabric type is required"),
  regionalVarieties: z.string().min(1, "Regional varieties is required"),
  price: z.number().min(0, "Price must be positive"),
  discounts: z.number().min(0).max(100, "Discount must be between 0-100"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  availability: z.enum(["In Stock", "Out of Stock", "Limited"]),
  productType: z.enum(["saree", "suits", "boutique-fabrics", "accessories"]),
  shortDescription: z.string().min(10, "Description must be at least 10 characters"),
})

type ProductFormData = z.infer<typeof productSchema>

interface AddProductFormProps {
  editProduct?: Product
  onCancel?: () => void
  onProductAdded: (product: Product) => void
  onViewChange: (view: "dashboard" | "add-product" | "inventory") => void
}

export default function AddProductForm({ editProduct, onCancel, onProductAdded, onViewChange }: AddProductFormProps) {
  const [images, setImages] = useState<string[]>(editProduct?.images || [])
  const [sizes, setSizes] = useState<string[]>(editProduct?.sizes || [])
  const [newSize, setNewSize] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editProduct
      ? {
          name: editProduct.name,
          fabricType: editProduct.fabricType,
          regionalVarieties: editProduct.regionalVarieties,
          price: editProduct.price,
          discounts: editProduct.discounts,
          sizes: editProduct.sizes,
          availability: editProduct.availability,
          productType: editProduct.productType,
          shortDescription: editProduct.shortDescription,
        }
      : undefined,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 4) {
      alert("Maximum 4 images allowed")
      return
    }

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImages((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      const updatedSizes = [...sizes, newSize.trim()]
      setSizes(updatedSizes)
      setValue("sizes", updatedSizes)
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    const updatedSizes = sizes.filter((s) => s !== size)
    setSizes(updatedSizes)
    setValue("sizes", updatedSizes)
  }

  const onSubmit = (data: ProductFormData) => {
    const product: Product = {
      id: editProduct?.id || Date.now().toString(),
      ...data,
      images,
      createdAt: editProduct?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onProductAdded(product)

    if (!editProduct) {
      reset()
      setImages([])
      setSizes([])
      onViewChange("dashboard")
    }

    if (onCancel) onCancel()
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{editProduct ? "Edit Product" : "Add New Product"}</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              {...register("name")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Fabric Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Type *</label>
            <input
              {...register("fabricType")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Silk, Cotton, Georgette"
            />
            {errors.fabricType && <p className="text-red-500 text-sm mt-1">{errors.fabricType.message}</p>}
          </div>

          {/* Regional Varieties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Regional Varieties *</label>
            <input
              {...register("regionalVarieties")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Banarasi, Kanjivaram, Chanderi"
            />
            {errors.regionalVarieties && (
              <p className="text-red-500 text-sm mt-1">{errors.regionalVarieties.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          {/* Discounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discounts (%) *</label>
            <input
              {...register("discounts", { valueAsNumber: true })}
              type="number"
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter discount percentage"
            />
            {errors.discounts && <p className="text-red-500 text-sm mt-1">{errors.discounts.message}</p>}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
            <select
              {...register("availability")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Limited">Limited</option>
            </select>
            {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
            <select
              {...register("productType")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select product type</option>
              <option value="saree">Saree</option>
              <option value="suits">Suits</option>
              <option value="boutique-fabrics">Boutique Fabrics</option>
              <option value="accessories">Accessories</option>
            </select>
            {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType.message}</p>}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes *</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Add size (e.g., S, M, L, XL, Free Size)"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
            />
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.sizes && <p className="text-red-500 text-sm mt-1">{errors.sizes.message}</p>}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
          <textarea
            {...register("shortDescription")}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter product description"
          />
          {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (Max 4)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-amber-500 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload Image</p>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <motion.button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="h-4 w-4" />
            <span>{editProduct ? "Update Product" : "Add Product"}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
