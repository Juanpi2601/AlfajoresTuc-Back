import Jwt from "jsonwebtoken";
import { TOKEN } from "../services/user.services.js";
import { ADMIN_KEY, USER_KEY} from "../server/server.js";

export const signToken = (user) => {
  const signedToken = Jwt.sign(
    {
      _id: user._id,
      role: user.role
    },
    SECRET
    );

    const key = user.role === "User" ? USER_KEY : ADMIN_KEY;

    const authObj = {
      token: signedToken,
      key: key,
    }

    return authObj;
};