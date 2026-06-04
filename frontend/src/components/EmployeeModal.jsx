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
      [e.target.name]: [e.target.value],
    }));
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
        return toast.error("Please fill are fileds");
      }
    }

    type === "add" ? addMutation.mutate(info) : updateMutation.mutate(info);
  };

  const formField = [
    { label: "Name", name: name },
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
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40"
          >
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-gray-100 p-6 shadow-[10px_10px_25px_#c5c5c5,-10px_-10px_25px]">
              <div className="flex items-center justify-between md-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  {type === "add" ? "Add Employee" : "Update Employee"}
                </h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <IoCloseSharp />
                </button>
              </div>
              <div>
                {formField.map((field) => (
                  <div key={field.name}>
                    <label>{field.label}</label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={info[field.name]}
                      onChange={handleChanges}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label>Role</label>
                <select
                  value={info.role}
                  onChange={(e) =>
                    setInfo((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Role</option>
                  <option value="HR">HR</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
                <button onClick={handleFormSubmission}>
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
