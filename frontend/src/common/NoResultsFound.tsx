import React from "react";

const NoResultsFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start h-screen pt-10">
      <img
        src="/no-results-found.png"
        alt="No Results Found"
        className="w-1/6 mb-4"
      />
      <p className="text-lg text-gray-600">
        Sorry, keine Ergebnisse gefunden :(
      </p>
    </div>
  );
};

export default NoResultsFound;
