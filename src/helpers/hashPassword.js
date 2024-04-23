import bcrypt from "bcrypt";

const saltRound = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRound);
  return bcrypt.hash(password, salt);
};
