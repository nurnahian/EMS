import express from "express";

import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployee,
  getEmployee,
} from "../controllers/employeeController.js";

const routes = express.Router();

routes.post("/", createEmployee);
routes.get("/", getAllEmployee);
routes.put("/:id", updateEmployee);
routes.delete("/:id", deleteEmployee);
routes.get("/:id", deleteEmployee);

export default routes;
