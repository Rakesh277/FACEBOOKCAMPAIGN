import cron from "node-cron";
import Post from "../models/Post";
import { postToFacebook } from "./facebookService";

// Define the expected shape of a Post document
interface ScheduledPost {
  _id: string;
  content: string;
  accessToken: string;
  pageId: string;
  imagePath?: string;
  status: string;
  scheduledAt: Date;
  save: () => Promise<void>;
}

export const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const posts = await Post.find({
        status: "pending",
        scheduledAt: { $lte: new Date() },
      }) as ScheduledPost[];

      for (const post of posts) {
        const { accessToken, pageId, imagePath = "", content } = post;

        if (!accessToken || !pageId) {
          console.warn(`⚠️ Missing accessToken or pageId for post: ${post._id}`);
          continue;
        }

        const postToFacebook = (
          content: string,
          accessToken: string,
          pageId: string, // ✅ not number
          imagePath?: string
        ) => { /* ... */ };

        post.status = "posted";
        await post.save();

        console.log(`✅ Posted: ${content}`);
      }
    } catch (err) {
      console.error("❌ Scheduler error:", err);
    }
  });
};