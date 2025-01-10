import React, { useState } from "react";
import Modal from "./Modal";
import RegisterForm from "./register-form";

export default function Register() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
      >
        Open Register
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RegisterForm />
      </Modal>
    </div>
  );
}
