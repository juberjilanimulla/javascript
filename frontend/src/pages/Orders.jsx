import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../helper/StatCard";

const emptyForm = { userId: "", productId: "", quantity: 1, status: "pending" };

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/users"),
        api.get("/products"),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.productId || !form.quantity) {
      setError("User, product, and quantity are required");
      return;
    }
    setError("");
    const payload = {
      userId: Number(form.userId),
      productId: Number(form.productId),
      quantity: Number(form.quantity),
      status: form.status,
    };
    try {
      if (editingId) {
        await api.put(`/orders/${editingId}`, payload);
      } else {
        await api.post("/orders", payload);
      }
      resetForm();
      loadAll();
    } catch (err) {
      setError("Failed to save order");
      console.error(err);
    }
  };

  const handleEdit = (o) => {
    setForm({
      userId: o.userId,
      productId: o.productId,
      quantity: o.quantity,
      status: o.status,
    });
    setEditingId(o.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      loadAll();
    } catch (err) {
      setError("Failed to delete order");
      console.error(err);
    }
  };

  const findProduct = (id) => products.find((p) => p.id === id);
  const findUser = (id) => users.find((u) => u.id === id);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => {
      const product = findProduct(o.productId);
      return sum + (product ? product.price * o.quantity : 0);
    }, 0);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">Track and manage customer orders</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm((s) => !s);
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {showForm ? "Close" : "+ New order"}
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Pending" value={pendingCount} tone="blue" />
        <StatCard label="Completed" value={completedCount} tone="green" />
        <StatCard label="Revenue" value={`₹${revenue}`} tone="purple" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-5"
        >
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.price})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            min="1"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const product = findProduct(o.productId);
                    const user = findUser(o.userId);
                    const total = product ? product.price * o.quantity : "—";
                    return (
                      <tr key={o.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {user?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {product?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{o.quantity}</td>
                        <td className="px-4 py-3 text-slate-600">₹{total}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              statusStyles[o.status] || statusStyles.pending
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="space-x-3 px-4 py-3 text-right">
                          <button
                            onClick={() => handleEdit(o)}
                            className="font-medium text-brand-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="space-y-3 sm:hidden">
            {orders.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-slate-400">
                No orders yet
              </p>
            ) : (
              orders.map((o) => {
                const product = findProduct(o.productId);
                const user = findUser(o.userId);
                const total = product ? product.price * o.quantity : "—";
                return (
                  <div key={o.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{user?.name || "—"}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {product?.name || "—"} · Qty {o.quantity} · ₹{total}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[o.status] || statusStyles.pending
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <div className="space-x-3 text-sm">
                        <button onClick={() => handleEdit(o)} className="font-medium text-brand-600">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(o.id)} className="font-medium text-red-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}