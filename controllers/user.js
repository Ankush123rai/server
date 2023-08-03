import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookies } from "../utiles/features.js";

export const getAllUsers = async (req, res) => {};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return res.status(404).json({
      success: false,
      message: "Invaild Email or Passord",
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(404).json({
      success: false,
      message: "Invaild Email or Passord",
    });

  sendCookies(user, res, `welcome back ${user.name}`, 200);
};

export const register = async (req, res) => {
  const { name, email,address,gist,password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(404).json({
      success: false,
      message: "User Already Exit",
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    address,
    gist,
    password: hashedPassword,
  });
  sendCookies(user, res, "Register successfully", 201);
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req,res) => {
  res
    .status(200)
    .cookie("token", "",{expires:new Date(Date.now())})
    .json({
      success: true,
      user: req.user,
    });
};
