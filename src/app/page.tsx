"use client"
import AdminOrders from "../components/adminOrders";
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"
import NavBar from "../components/navBar"

type Product = {
  _id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category: string
  dimensions?: string
}

type Order = {
  _id: string
  user: { email: string }
  products: { productId: Product; quantity: number }[]
  total: number
  status: string
}

export default function HomePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    category: "",
    dimensions: "",
  })

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/users/profile")
        if (res.data?.success) setUser(res.data.user)
        else setUser(null)
      } catch {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }
    fetchProfile()
  }, [])

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/list")
      if (res.data?.success) setProducts(res.data.products || [])
    } catch (e) {
      console.error("Failed to fetch products", e)
    } finally {
      setLoadingProducts(false)
    }
  }

  //Fetch orders (only if admin)
  const fetchOrders = async () => {
    if (!user?.isAdmin) return
    try {
      const res = await axios.get("/api/admin/showOrders")
      if (res.data?.success) setOrders(res.data.orders || [])
    } catch (e) {
      console.error("Failed to fetch orders", e)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (user?.isAdmin) fetchOrders()
  }, [user])

  // Auth redirects
  const goLoginWithParams = (pId: string, action: "cart" | "buy") => {
    const params = new URLSearchParams({
      redirect: pathname || "/",
      pId,
      action,
    })
    router.push(`/login?${params.toString()}`)
  }

  const handleAddToCart = (id: string) => {
    if (!user) {
      goLoginWithParams(id, "cart")
      return
    }
    router.push(`/cart?pId=${id}`)
  }

  const handleBuyNow = (id: string) => {
    if (!user) {
      goLoginWithParams(id, "buy")
      return
    }
    router.push(`/checkout?pId=${id}`)
  }

  // Add product
  const handleAddProduct = async () => {
    try {
      const res = await axios.post("/api/admin/addProduct", {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      })
      if (res.data?.success) {
        setProducts((prev) => [res.data.product, ...prev])
        setShowAddProduct(false)
        setProduct({ name: "", description: "", price: "", image: "", stock: "", category: "", dimensions: "" })
      } else {
        alert(res.data?.error || "Failed to add product")
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add product")
    }
  }

  // Update product
  const handleUpdateProduct = async () => {
    if (!editingProduct) return
    try {
      const res = await axios.put(`/api/admin/updateProduct/${editingProduct._id}`, {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      })
      if (res.data?.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? res.data.product : p))
        )
        setEditingProduct(null)
        setProduct({ name: "", description: "", price: "", image: "", stock: "", category: "", dimensions: "" })
      } else {
        alert(res.data?.error || "Failed to update product")
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update product")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <NavBar user={user} />

      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* Admin Add/Update Product */}
        {!loadingUser && user?.isAdmin && (
          <section className="mb-10">
            {!showAddProduct && !editingProduct ? (
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow font-medium"
              >
                + Add Product
              </button>
            ) : (
              <div className="rounded-2xl bg-white shadow-xl p-6 border border-gray-100 max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {editingProduct ? "Update Product" : "Add New Product"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["name", "price", "description", "image", "stock", "category", "dimensions"].map((field) => (
                    <div key={field} className={`flex flex-col gap-2 ${field === "description" ? "md:col-span-2" : ""}`}>
                      <label className="text-sm text-gray-600 capitalize">{field}</label>
                      {field === "description" ? (
                        <textarea
                          value={product[field as keyof typeof product]}
                          onChange={(e) => setProduct({ ...product, [field]: e.target.value })}
                          className="border rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 min-h-[90px]"
                        />
                      ) : (
                        <input
                          type={field === "price" || field === "stock" ? "number" : "text"}
                          value={product[field as keyof typeof product]}
                          onChange={(e) => setProduct({ ...product, [field]: e.target.value })}
                          className="border rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  {editingProduct ? (
                    <button
                      onClick={handleUpdateProduct}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow font-medium"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      onClick={handleAddProduct}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow font-medium"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowAddProduct(false)
                      setEditingProduct(null)
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl shadow font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Product Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500">{products.length} items</p>
          </div>
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p._id} className="group bg-white rounded-2xl shadow hover:shadow-xl transition-all border">
                <img src={p.image} alt={p.name} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <p className="text-xs text-gray-500">Dimensions: {p.dimensions || "N/A"}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-indigo-600">₹{p.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      disabled={p.stock <= 0}
                      onClick={() => handleAddToCart(p._id)}
                      className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white"
                    >
                      Add to Cart
                    </button>
                    <button
                      disabled={p.stock <= 0}
                      onClick={() => handleBuyNow(p._id)}
                      className="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white"
                    >
                      Buy Now
                    </button>
                  </div>
                  {user?.isAdmin && (
                    <button
                      onClick={() => {
                        setEditingProduct(p)
                        setProduct({
                          name: p.name,
                          description: p.description,
                          price: String(p.price),
                          image: p.image,
                          stock: String(p.stock),
                          category: p.category,
                          dimensions: p.dimensions || "",
                        })
                      }}
                      className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl"
                    >
                      Edit Product
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Admin Orders Section */}
        {user?.isAdmin && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Orders</h2>
            <AdminOrders />
          </section>
        )}


      </main>
    </div>
  )
}
