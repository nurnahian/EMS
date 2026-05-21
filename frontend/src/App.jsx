import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["employee_details"],
    queryFn: fetchEmployeeDetails,
  });

  if (isPending) {
    return <div>Loding...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  // useEffect(() => {
  //   fetchEmployeeDetails();
  // }, []);
  return <div className="bg-amber-200 p-4">App</div>;
};

export default App;
