import express from "express";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import LessonsController from "../http/controller/lesson-controller"
const router = express.Router();

export interface courseLink {
  class: number;
  url: string;
  date: string;
  title: string;
  year: string;
  teacher: string;
  group: string;
  codeLesson: string;
}

export type RequestAddCourses = Request<{}, {}, { courseLinks: courseLink[] }>;
export type ResponseAddCourses = Response<{
  statusCode: number;
  msg: string;
}>;
router.post(
  "/addCourses",
  tryCatchHandler<RequestAddCourses, ResponseAddCourses>(LessonsController.addCourses)
);

export default router;
