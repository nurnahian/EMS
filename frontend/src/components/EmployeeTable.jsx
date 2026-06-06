import React, { useState, useMemo } from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import EmployeeModal from "./EmployeeModal";
import { useMutation } from "@tanstack/react-query";
import { backendUrl } from "@/App";
import toast from "react-hot-toast";
import { queryClient } from "@/utils/queryClients";

const EmployeeTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data?.slice(start, end) || [];
  }, [data, currentPage, itemsPerPage]);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
      // Reset to first page if current page becomes empty
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  if (!data?.length) {
    return <div className="p-4 text-gray-500">No Employee data available</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-5 px-6 text-left font-semibold text-gray-700">
                  SL
                </th>
                <th className="py-5 px-6 text-left font-semibold text-gray-700">
                  Name
                </th>
                <th className="py-5 px-6 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="py-5 px-6 text-left font-semibold text-gray-700">
                  Age
                </th>
                <th className="py-5 px-6 text-left font-semibold text-gray-700">
                  Role
                </th>
                <th className="py-5 px-6 text-left font-semibold text-gray-700">
                  Salary
                </th>
                <th className="py-5 px-6 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/50 transition-all duration-200 group"
                >
                  <td className="py-5 px-6 font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-5 px-6 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-5 px-6 text-gray-600">{item.email}</td>
                  <td className="py-5 px-6 text-gray-600">{item.age}</td>
                  <td className="py-5 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {item.role}
                    </span>
                  </td>
                  <td className="py-5 px-6 font-medium text-gray-800">
                    ৳{Number(item.salary).toLocaleString()}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-105 active:scale-95"
                      >
                        <MdOutlineDelete size={20} />
                      </button>
                      <EmployeeModal data={item} type="update">
                        <button className="p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-600 transition-all hover:scale-105 active:scale-95">
                          <MdOutlineEdit size={20} />
                        </button>
                      </EmployeeModal>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * itemsPerPage, data.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{data.length}</span>{" "}
            entries
          </div>

          <div className="flex items-center gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-2xl bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <div className="px-5 py-2.5 bg-white border border-gray-300 rounded-2xl font-medium text-sm">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-2xl bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
