import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeTable from "./components/EmployeeTable";
import { Button } from "./components/ui/button";

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
  //console.log(data);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl justify-between">
            Employee Management
          </h1>
          <div className="pt-2 pb-2">
            <EmployeeModal type="add">
              {/* <button className="px-5 rounded-xl bg-gray-100 text-gray-700 shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]">
              Add Employee
            </button> */}
              <Button size="lg" className="cursor-pointer">
                Add Employee
              </Button>
            </EmployeeModal>
          </div>
        </div>
        <EmployeeTable data={data} />
      </div>
    </div>
  );
};

export default App;
