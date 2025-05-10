// SuccessModal.js
import React from 'react';

const SuccessModal = ({ closeModal }) => {
  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-8 rounded shadow-md">
        <span className="close absolute top-2 right-2 text-2xl cursor-pointer" onClick={closeModal}>&times;</span>
        <h2 className="text-2xl font-bold mb-4">Place Added Successfully!</h2>
        {/* Additional content or details can be added here */}
      </div>
    </div>
  );
};

export default SuccessModal;
