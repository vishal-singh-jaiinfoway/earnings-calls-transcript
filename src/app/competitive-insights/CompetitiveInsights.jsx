import SectionCard from './SectionCard';

const CompetitiveInsights = () => {
  const insights = [
    {
      title: 'Market Position',
      description: 'Strong market position with growing revenue.',
      icon: '📈'
    },
    {
      title: 'Strategic Advantage',
      description: 'Unique product and pricing edge.',
      icon: '🚀'
    },
    {
      title: 'Competitor Threats',
      description: 'Competitors gaining ground.',
      icon: '⚠️'
    }
  ];

  return (
    <SectionCard title="Competitive Strategy Insights">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((item, index) => (
          <div
            key={index}
            className="group relative p-6 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 backdrop-blur-md shadow-md rounded-xl overflow-hidden transition-transform transform hover:-translate-y-2"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00ffff10] to-[#ff00ff10] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              {/* <div className="text-3xl mb-3">{item.icon}</div> */}
              <strong className="text-lg font-semibold text-gray-800 leading-relaxed tracking-wide">
                {item.title}
              </strong>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
  
};

export default CompetitiveInsights;
