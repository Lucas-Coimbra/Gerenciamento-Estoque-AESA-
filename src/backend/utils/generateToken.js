import jwt from "jsonwebtoken";

export const generateToken = (userId, nivel) => {
  return jwt.sign({ id: userId, nivel }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};
