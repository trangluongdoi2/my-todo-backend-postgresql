import { Router } from "express";
import UserController from "@/controller/user.controller";

const router = Router();
router.post('/users/create', UserController.createUser)
export default router;