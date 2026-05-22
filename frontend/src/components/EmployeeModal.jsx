import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { queryClient } from "../utils/queryClients.js";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const EmployeeModal = (data) => {
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

  return (
    <div>
      <div>{children}</div>
      {isOpen && (
        <div onClick={() => setIsOpen(false)}>
          <div>
            <div>
              <h2>{type === "add" ? "Add Employee" : "Update Employee"}</h2>
              <button>
                <IoCloseSharp />
              </button>
            </div>
            <div>
              {[
                { label: "Name", name: name },
                { label: "Email", name: "email" },
                { label: "Age", name: "age", type: "number" },
                { label: "Salary", name: "salary" },
              ].map((field) => (
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
              <button>{type === "add" ? "Add" : "Update"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeModal;
