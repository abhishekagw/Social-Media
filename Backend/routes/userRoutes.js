import express from "express";
import protectRoute from "../middleware/proctectRoute.js";
import { getUsersView } from "../controllers/userController.js";

const router = express.Router();


router.get('/',protectRoute,getUsersView)

export default router;
