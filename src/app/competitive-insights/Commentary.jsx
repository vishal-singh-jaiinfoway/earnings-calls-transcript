import SectionCard from './SectionCard';

const Commentary = () => {
  const commentaryItems = [
    {
      icon: '🗣',
      title: 'CEO Quotes:',
      description: 'Pricing power and growth strategies.'
    },
    {
      icon: '📢',
      title: 'Analyst Sentiment:',
      description: 'Upgrades and key concerns.'
    }
  ];

  return (
    <SectionCard title="Management Commentary & Market Sentiment">
      <ul className="space-y-4">
        {commentaryItems.map((item, index) => (
          <li
            key={index}
            className="group relative p-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 backdrop-blur-md shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Glow effect on hover */}
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

export default Commentary;
