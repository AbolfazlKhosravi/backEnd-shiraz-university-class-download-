import { NextFunction, Request, Response } from "express-serve-static-core";
import createError, { HttpError } from "http-errors";
import pool from "../utils/mysql-database";
import allRoutes from "./router/router";
import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import TelegramBot from "./telegramBot/telegramBot";
import { ResultGetCourses } from "./models/lessons-model";
import LessonsModel from "./models/lessons-model"; // REFACTOR:

class Application {
  #app = express();
  #Port = process.env.APP_PORT || 5500;
  // @ts-ignore
  static lessonsState: ResultGetCourses = [];
  private telegramBot = new TelegramBot();

  constructor() {
    this.createServer();
    this.connectToMYSQL();
    this.configServer();
    this.configRoutes();
    this.errorHandling();
    try {
      Application.updateLessonsState().then(() => this.telegramBot.start());
    } catch (error) {
      console.log("error in telegramBot start: " + error);
    }
  }

  createServer(): void {
    this.#app.listen(this.#Port, () => {
      console.log(
        "app in running on port " +
          this.#Port +
          " (env: " +
          process.env.NODE_ENV
      );
    });
  }
  async connectToMYSQL(): Promise<void> {
    try {
      const connection = await pool.getConnection();
      console.log("Connected to MySQL database!");
      connection.release();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Database connection error:", error);
      }
    }
  }
  configServer(): void {
    this.#app.use(
      cors({ credentials: true, origin: process.env.ALLOW_CORS_ORIGIN })
    );
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "..", "public")));
  }

  configRoutes(): void {
    this.#app.use("/api", allRoutes);
  }

  errorHandling(): void {
    this.#app.use((_req: Request, _res: Response, next: NextFunction) => {
      next(createError.NotFound("ادرس مورد نظر یافت نشد"));
    });
    this.#app.use(
      (
        error: HttpError,
        _req: Request,
        res: Response<{ message: string; statusCode: number }>,
        _next: NextFunction
      ) => {
        const serverError: HttpError = createError.InternalServerError();
        const statusCode: number = error.status || serverError.status;
        const message: string = error.message || serverError.message;
        res.status(statusCode).json({
          statusCode,
          message,
        });
      }
    );
  }

  static async updateLessonsState() {
    Application.lessonsState = await LessonsModel.getCourses();
    console.log("LessonsState updated!");
    // console.log("LessonsState: ", Application.lessonsState);
  }
}
export default Application;
