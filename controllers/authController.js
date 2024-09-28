import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(name, email, password, role, "data")
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User with that email id is already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body, "req body")
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with that email id does not exists" });
        }
        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const data = {
            id: user._id,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "User login successful", user, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}