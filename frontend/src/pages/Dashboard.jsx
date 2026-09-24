import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../helper/StatCard";

export default function Dashboard() {
  const [counts, setCounts] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/users"),
          api.get("/products"),
          api.get("/orders"),
        ]);
        setCounts({
          users: usersRes.data.data.length,
          products: productsRes.data.data.length,
          orders: ordersRes.data.data.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Quick overview of your data</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total users" value={counts.users} tone="blue" />
          <StatCard label="Total products" value={counts.products} tone="green" />
          <StatCard label="Total orders" value={counts.orders} tone="purple" />
        </div>
      )}
    </div>
  );
}