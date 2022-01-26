import { Router } from "express";
import * as sFunctions from "../controllers/shared.controller";

const shared_router = Router();

shared_router.route('/add')
    .post(sFunctions.addShare);

shared_router.route('/get')
    .post(sFunctions.getShare);


export default shared_router;
