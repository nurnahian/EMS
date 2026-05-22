import React from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const EmployeeTable = ({ data }) => {
  if (!data?.length) {
    return <div className="p-4 text-gray-500">No Employee data availavle</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-255  rounded-xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">E-mail</th>
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr
                key={item.id}
                className="text-sm text-gray-700 rounded-2xl transition hover:bg-gray-200/60 shadow-[inset_1px_1px_2px_#e5e5e5] p-4"
              >
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">{item.age}</td>
                <td className="py-3 px-4">{item.role}</td>
                <td className="py-3 px-4">{item.salary}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:shadow-inner text-red-600 transition">
                      <MdOutlineDelete />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:shadow-inner text-green-600 transition">
                      <MdOutlineEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
