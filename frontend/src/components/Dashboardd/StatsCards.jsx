function StatsCards({ cards }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border shadow-sm"
        >
          <div className="text-sm text-gray-500">{c.label}</div>
          <div className="text-2xl font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;