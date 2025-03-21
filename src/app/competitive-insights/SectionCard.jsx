const SectionCard = ({ title, children }) => {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-md p-6 border-t">
      {/* <h2 className="text-2xl font-semibold mb-4 text-gray-600">{title}</h2> */}
      {children}
    </div>
  );
};

export default SectionCard;
