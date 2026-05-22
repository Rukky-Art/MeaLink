const styles = {
  Available: "bg-emerald-50 text-emerald-700",
  Claimed: "bg-amber-50 text-amber-700",
  "Picked Up": "bg-blue-50 text-blue-700",
  Distributed: "bg-teal-50 text-teal-700",
  Expired: "bg-red-50 text-red-600",
};

function Badge({ status }) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}

export default Badge;