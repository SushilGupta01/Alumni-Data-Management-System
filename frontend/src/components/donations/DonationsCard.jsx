import React from 'react';
import { Edit2, Trash2, DollarSign } from 'lucide-react';

const DonationCard = ({ donation, onEdit, onDelete, canEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">₹{donation.amount}</h3>
            <p className="text-sm text-gray-500">{donation.alumni_name}</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(donation)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(donation.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Date:</span> {new Date(donation.donation_date).toLocaleDateString()}</p>
        <p><span className="font-medium">Purpose:</span> {donation.purpose || 'N/A'}</p>
      </div>
    </div>
  );
};

export default DonationCard;