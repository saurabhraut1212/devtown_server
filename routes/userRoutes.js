import express from "express";
import { login, register } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { loginValidation, registerValidation } from "../validators/userValidators.js";

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

export default router;