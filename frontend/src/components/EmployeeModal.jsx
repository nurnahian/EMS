import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { queryClient } from "../utils/queryClients.js";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const EmployeeModal = ({ children, type = "add", data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState(
    type === "add"
      ? { name: "", email: "", age: "", salary: "", role: "" }
      : data,
  );

  const handleChanges = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFrom = () => {
    setInfo({ name: "", email: "", age: "", salary: "", role: "" });
  };
  /**
   * Create
   */
  const addMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Employee added successfully");
      resetFrom();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
    onError: (err) => toast.error(err.message),
  });

  /**
   * Update Methode
   */
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${backendUrl}/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Employee updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
    onError: (err) => toast.error(err.message),
  });

  /**
   *
   * @returns
   */
  const handleFormSubmission = () => {
    const required = ["name", "email", "age", "salary", "role"];

    for (const field of required) {
      if (!info[field]?.toString().trim()) {
        return toast.error("Please fill all fields");
      }
    }

    type === "add" ? addMutation.mutate(info) : updateMutation.mutate(info);
  };

  const formField = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Age", name: "age", type: "number" },
    { label: "Salary", name: "salary" },
  ];

  return (
    <>
      <div className="inline-block" onClick={() => setIsOpen(true)}>
        {children}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            // if need to click any there of the modal and close the modal then apply this
            //onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 flex justify-center items-center p-4"
          >
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-gray-100 p-6 shadow-[5px_5px_15px_#c5c5c5,-5px_-5px_15px]">
              <div className="flex items-center justify-between md-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  {type === "add" ? "Add Employee" : "Update Employee"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <IoCloseSharp />
                </button>
              </div>
              <div className="space-y-4">
                {formField.map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-600 text-sm mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={info[field.name]}
                      onChange={handleChanges}
                      className="w-full px-4 py-2 rounded-xl bg-gray-100 shadow outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                <label className="block  mb-1">Role</label>
                <select
                  value={info.role}
                  onChange={(e) =>
                    setInfo((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-xl bg-gray-100 shadow outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Role</option>
                  <option value="HR">HR</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  <option value="Intern">Intern</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-between gap-4 mt-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#fff] hover:shadow-inner"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmission}
                  className="bg-[#1ba802] py-2 px-4 text-white font-semibold rounded-2xl cursor-pointer shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#fff]"
                >
                  {type === "add" ? "Add" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeModal;
