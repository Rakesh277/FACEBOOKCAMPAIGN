import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include Meta context
declare module "express-serve-static-core" {
  interface Request {
    meta?: {
      accessToken: string;
      pageId: string;
    };
  }
}

export const mcpMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[MCP] ${req.method} ${req.path}`);

  const accessToken = req.headers["access-token"];
  const pageId = req.headers["page-id"];

  if (!accessToken || !pageId) {
    return res.status(400).json({
      error: "Missing required headers: access-token and page-id",
    });
  }

  req.meta = {
    accessToken: accessToken.toString(),
    pageId: pageId.toString(),
  };

  next();
};