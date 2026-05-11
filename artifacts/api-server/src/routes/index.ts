import { Router, type IRouter } from "express";
import healthRouter from "./health";
import batteriesRouter from "./batteries";
import bannersRouter from "./banners";
import popupsRouter from "./popups";
import adminRouter from "./admin";
import finderRouter from "./finder";

const router: IRouter = Router();

router.use(healthRouter);
router.use(batteriesRouter);
router.use(bannersRouter);
router.use(popupsRouter);
router.use(adminRouter);
router.use(finderRouter);

export default router;
