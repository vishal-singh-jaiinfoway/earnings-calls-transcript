import SectionCard from './SectionCard';

const ExecutiveSummary = () => {
  const summaryItems = [
    {
      icon: '📌',
      title: 'Competitor Trends:',
      description: 'Demand, supply chain, and pricing strategies.'
    },
    {
      icon: '📌',
      title: 'Market Reaction:',
      description: 'Stock price and analyst commentary.'
    },
    {
      icon: '📌',
      title: 'Your Positioning:',
      description: 'Strengths vs. risks.'
    }
  ];

  return (
    <SectionCard title="Executive Summary">
      <ul className="space-y-4">
        {summaryItems.map((item, index) => (
          <li
            key={index}
            className="group relative p-4 rounded-xl bg-white border border-gray-300 shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Soft glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff10] to-[#ff00ff10] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-start gap-3">
              {/* <span className="text-2xl text-gray-600 transition-transform group-hover:scale-110">
                {item.icon}
              </span> */}
              <div>
                <strong className="text-lg font-semibold text-gray-800 leading-relaxed tracking-wide">
                  {item.title}
                </strong>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
  
};

export default ExecutiveSummary;
