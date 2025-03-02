import HttpStatus from "http-status-codes";
import { RequestAddCourses, ResponseAddCourses } from "../../router/lessons";
import { addCoursesArraySchema } from "../validators/lesson-schema";
import LessonsModel from "../../models/lessons-model";

const lessonsModel = new LessonsModel();
class LessonsController {
  async addCourses(req: RequestAddCourses, res: ResponseAddCourses) {
    console.log("request");

    await addCoursesArraySchema.validateAsync(req.body.courseLinks);

    const result = await lessonsModel.addCourses(req.body.courseLinks);

    if (!result.affectedRows) {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        msg: "دیتایی به دیتا بیس اضافه نشد ممکنه یک اروری باشد یا دیتا ها به روز بودن و نیازی به اضافه شدن نبوده",
      });
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      msg: "دیتا ها به دیتا بیس اضافه شدن ",
    });
  }
}

export default new LessonsController();
