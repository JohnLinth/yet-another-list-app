import React from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <HourglassBottomIcon className="w-1/6 mb-4 animate-spin" />
      <p className="text-lg text-gray-600">Bitte warten, wird geladen...</p>
    </div>
  );
};

export default Loading;
