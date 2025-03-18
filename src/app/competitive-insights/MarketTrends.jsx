import SectionCard from './SectionCard';
import { Urbanist,Inter } from "next/font/google";
const inter = Inter({ subsets: ['latin'], weight: ["400"] });

const MarketTrends = () => {
  const trends = [
    {
      icon: '🚗',
      title: 'Segment Breakdown:',
      description: 'ICE vs. EV, Premium vs. Mass Market.'
    },
    {
      icon: '🌍',
      title: 'Regional Trends:',
      description: 'US, Europe, China, Emerging Markets.'
    },
    {
      icon: '📊',
      title: 'Policy Impact:',
      description: 'EV incentives, trade tariffs.'
    }
  ];

  return (
    <SectionCard title="Market & Segment Trends">
      <ul className="space-y-4">
        {trends.map((trend, index) => (
          <li
            key={index}
            className="group relative p-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 backdrop-blur-md shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff10] to-[#ff00ff10] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-start gap-3">
              {/* <span className="text-2xl transition-transform group-hover:scale-110">{trend.icon}</span> */}
              <div>
                <strong className="text-lg font-semibold text-gray-800 leading-relaxed tracking-wide">
                  {trend.title}
                </strong>
                <p className="text-gray-600 mt-1">{trend.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
  
};

export default MarketTrends;
