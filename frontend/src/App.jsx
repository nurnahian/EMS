import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeTable from "./components/EmployeeTable";

export const backendUrl = "http://localhost:5001/api/employee";

const App = () => {
  async function fetchEmployeeDetails() {
    const result = await fetch(backendUrl);
    const data = await result.json();
    if (!result.ok) {
      throw new Error(data.error);
    }

    return data;
    // console.log(data);
  }

  const {
    isPending,
    isError,
    data = [],
    error,
  } = useQuery({
    queryKey: ["employee_details"],
    queryFn: fetchEmployeeDetails,
  });
  console.log(data);
  if (isPending) {
    return <div>Loding...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  // useEffect(() => {
  //   fetchEmployeeDetails();
  // }, []);
  return (
    <div>
      <div>
        <div>
          <h1 className="text-center">Employee Management</h1>
          <EmployeeModal type="add">
            <button className="px-5 rounded-xl bg-gray-100 text-gray-700 shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]">
              Add Employee
            </button>
          </EmployeeModal>
        </div>
        <EmployeeTable data={data} />
      </div>
    </div>
  );
};

export default App;
