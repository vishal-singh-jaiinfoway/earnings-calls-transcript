import DynamicChartCreator from './DynamicChartCreator';

const FinancialPerformance = ({chartData,setChartData}) => {
  return (
    <div className="space-y-8">
      {/* Dynamic Chart Section */}
      <DynamicChartCreator chartData={chartData} setChartData={setChartData}/>
    </div>
  );
};

export default FinancialPerformance;
