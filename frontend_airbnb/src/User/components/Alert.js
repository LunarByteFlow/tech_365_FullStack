import React from "react";

const Alert = ({ message }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-green-500 text-white py-4 px-6 rounded-md shadow-md">
          <svg
            className="w-6 h-6 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold">{message}</span>
        </div>
      </div>
    </>
  );
};

export default Alert;
