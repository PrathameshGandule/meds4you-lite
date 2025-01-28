import pkg from "bcryptjs";
const { hash , compare } = pkg;
import jpkg from 'jsonwebtoken';
const { sign } = jpkg;
import User from "../models/User.js"

const registerUser= async(req, res, next) => {
    try{
        const { email , password } = req.body

        if(!email || !password){
            return res.status(400).json({ message: "Please fill all fields !" });
        }

        // if(role === "user" && (!managerId || !adminId)){
        //     return res.status(400).json({ message: "Please provide managerId and adminId !" });
        // }

        // if(role === "manager" && !adminId){
        //     return res.status(400).json({ message: "Please provide adminId !" });
        // }

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
                message: `User with email ${email} already exists !`
            });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = new User({ email , password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            message: `User registered with email ${email}`
        });
    } catch(err) {
        next(err);
    }
};

const login = async(req, res) => {
    try{
        const { email , password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "Please fill all fields !" });
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                message: `User with username ${email} not found !`
            });
        }

        const isMatch = await compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid Password !" })
        }

        const token = sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch(err) {
        next(err);
    }
}

export { registerUser , login };