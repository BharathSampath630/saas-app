'use client';

import { deleteCompanion } from "@/lib/actions/companions.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface DeleteCompanionButtonProps {
  companionId: string;
  companionName: string;
}

const DeleteCompanionButton = ({ companionId, companionName }: DeleteCompanionButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCompanion(companionId);
      router.push('/companions');
    } catch (error) {
      console.error('Failed to delete companion:', error);
      alert('Failed to delete companion. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-800">
          Are you sure you want to delete "{companionName}"? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Delete Companion
    </button>
  );
};

export default DeleteCompanionButton;