import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { Customer } from '../types/customer';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onView: (customer: Customer) => void;
  isMobile: boolean;
}

export function CustomerList({ customers, onEdit, onDelete, onView, isMobile }: CustomerListProps) {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            onClick={() => onView(customer)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(customer);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(customer.id);
                  }}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Shirt:</span> {customer.shirt}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Pants:</span> {customer.pants}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shirt Measurements
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pants Measurements
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {customer.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.shirt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.pants}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(customer)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}