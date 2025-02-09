import Joi from "joi";
import createHttpError from "http-errors";

export const addCoursesSchema = Joi.object({
  class: Joi.number()
    .required()
    .error(createHttpError.BadRequest("کلاس دیتایی ندارد")),

  url: Joi.string()
    .required()
    .error(createHttpError.BadRequest("آدرس URL معتبر نیست")),

  date: Joi.string()
    .required()
    .error(createHttpError.BadRequest("تاریخ معتبر نیست")),

  title: Joi.string()
    .required()
    .error(createHttpError.BadRequest("عنوان باید  باشد")),

  year: Joi.string()
    .required()
    .error(createHttpError.BadRequest("سال معتبر نیست")),

  teacher: Joi.string()
    .required()
    .error(createHttpError.BadRequest("نام استاد خالی است")),

  group: Joi.string()
    .required()
    .error(createHttpError.BadRequest("گروه خالی است")),

  codeLesson: Joi.string()
    .required()
    .error(createHttpError.BadRequest("کد درس باید مشخص باشد")),
});

export const addCoursesArraySchema = Joi.array()
  .items(addCoursesSchema)
  .required()
  .min(1) 
  .error(createHttpError.BadRequest("هر ابجکت باید دارای تمام ویژگی‌های مورد نیاز باشد"));