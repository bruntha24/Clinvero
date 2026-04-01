"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DeleteSlotModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteSlotModal({ isOpen, onCancel, onConfirm }: DeleteSlotModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6 w-80 text-center border border-teal-300"
          >
            <p className="text-gray-900 font-semibold mb-4">Do you want to delete this slot?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                No
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}