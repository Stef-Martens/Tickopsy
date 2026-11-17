import { Router } from "express";
import accountRoutes from "./account.routes";
import ticketRoutes from "./ticket.routes";
import userRoutes from "./user.route";
import authRoutes from "./auth.routes";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use("/", authRoutes);
// Everything except the public auth routes requires a valid Supabase session
router.use("/accounts", requireAuth, accountRoutes);
router.use("/users", requireAuth, userRoutes);
router.use("/tickets", requireAuth, ticketRoutes);

export default router;
