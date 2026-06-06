import { query } from "../utils/connectDB.js";
import {
  createEmployeeQuery,
  createEmployeeTableQuery,
  createRoleQuery,
  deleteEmployeeQuery,
  getAllEmployeeQuery,
  getEmployeeQuery,
  updateEmployeeQuery,
} from "../utils/sqlQuery.js";

const createEmployee = async (req, res, next) => {
  try {
    const { name, email, age, role, salary } = req.body;
    if (!name || !email || !age || !role || !salary) {
      return res.json({ error: "Missing fields" });
    }
    const data = await query(createEmployeeQuery, [
      name,
      email,
      age,
      role,
      salary,
    ]);

    res.json(data.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, email, age, role, salary } = req.body;

    const result = await query(updateEmployeeQuery, [
      name,
      email,
      age,
      role,
      salary,
      id
    ]);

    if (result.rowCount === 0) {
      return res.json({ error: "Employee not update" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await query(deleteEmployeeQuery, [id]);
    //console.log(result);

    if (!result.rowCount) {
      return res.json({ error: "Employee record not found" });
    }
    res.json({ message: "Employee successfully deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

const getAllEmployee = async (req, res, next) => {
  try {
    const response = await query(`SELECT to_regclass('employee_details')`);
    // console.log(response);
    if (!response.rows[0].to_regclass) {
      await query(createRoleQuery);
      await query(createEmployeeTableQuery);
    }
    const { rows } = await query(getAllEmployeeQuery);
    res.json(rows);
  } catch (error) {
    console.log(error.message);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await query(getEmployeeQuery, [id]);
    // console.log(result);

    if (result.rowCount === 0) {
      return res.json({ error: "Employee record not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

export {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployee,
  getEmployee,
};
