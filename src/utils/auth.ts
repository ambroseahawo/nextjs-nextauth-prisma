import * as argon2 from "argon2";

// hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

// verify hashed password
export const verifyPassword = async (hashedPassword: string, password: string): Promise<boolean> => {
  return await argon2.verify(hashedPassword, password);
};
