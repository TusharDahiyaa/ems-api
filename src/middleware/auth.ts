import jwt from "jsonwebtoken";
import prisma from "../client";
require("dotenv").config();

const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    // Get user roles from decoded token and user association
    const user = await prisma.user.findUnique({
      where: { username: decoded.userName },
      include: { Role: true }, // Include the Role relation
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Include role object in response
    req.body.role = user.Role;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
