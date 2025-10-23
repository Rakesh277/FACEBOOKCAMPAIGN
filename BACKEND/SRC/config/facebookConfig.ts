import dotenv from "dotenv";
dotenv.config();

export const FB_PAGE_ID = process.env.FB_PAGE_ID || "";
export const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || "";
export const FB_API_URL = `https://graph.facebook.com/v18.0/${FB_PAGE_ID}`;
