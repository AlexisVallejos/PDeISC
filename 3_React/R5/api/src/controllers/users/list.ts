import type { NextFunction, Request, Response } from "express";
import { listUsers } from "../../services/users/listUsers.js";
import { cleanText } from "../../validators/text.js";

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = cleanText(req.body.search).slice(0, 100);
    res.json({ users: await listUsers(search) });
  } catch (error) {
    next(error);
  }
}
