const ImpactStats = () => {
  const stats = [
    { label: "Meals redistributed", value: "12,400+" },
    { label: "Active partners", value: "86" },
    { label: "Donations completed", value: "340+" },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-brand-green font-bold text-sm uppercase tracking-widest mb-4">Impact</h2>
      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 max-w-2xl">
        Numbers that mean meals on tables.
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-brand-green/5 transition-all duration-300">
            <p className="text-5xl font-bold text-brand-green mb-4">{stat.value}</p>
            <p className="text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactStats