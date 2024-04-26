import bcrypt from "bcrypt";

export const comparePasswords = async (password, hashedPassword) => {
  const checkPasswords = await bcrypt.compare(password, hashedPassword);
  return checkPasswords;
};
