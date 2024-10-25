"use client";

import React from "react";

const SkeletonLoader = ({ text = "", rows = 3 }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Loading {text}...</h2>
      <div className="space-y-6">
        {Array(rows)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-md shadow-sm animate-pulse"
            >
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>

              <div className="mt-4">
                <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
