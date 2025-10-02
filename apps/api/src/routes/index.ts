import { Router } from "express";
import accountRoutes from "./account.routes";
import ticketRoutes from "./ticket.routes";
import userRoutes from "./user.route";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/users", userRoutes);
router.use("/tickets", ticketRoutes);

export default router;
