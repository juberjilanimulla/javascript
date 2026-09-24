const gradients = {
  blue: "from-sky-50 to-cyan-50 text-sky-700",
  green: "from-emerald-50 to-teal-50 text-emerald-700",
  purple: "from-violet-50 to-fuchsia-50 text-violet-700",
};

export default function StatCard({ label, value, tone = "blue" }) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${gradients[tone]} border border-slate-100 px-4 py-4 sm:px-5 sm:py-5`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}</p>
    </div>
  );
}