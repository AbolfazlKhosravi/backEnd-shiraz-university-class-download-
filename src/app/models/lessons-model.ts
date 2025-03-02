import pool from "../../utils/mysql-database";
import { courseLink } from "../router/lessons";
import Application from "../server";

interface AddCoursesStatus {
  affectedRows: number;
}

export type course = { title: string; codeLesson: string };

export type ResultGetCourses = {
  title: string;
  codeLesson: string;
}[];

export type ResultGetCourseFormation = {
  year: string;
  group: string;
  codeLesson: string;
}[];
export type ResultGetCourseSessions = {
  date: string;
  url: string;
  class: number;
}[];

class LessonsModel {
  async addCourses(courseLinks: courseLink[]) {
    if (courseLinks.length === 0) {
      return { affectedRows: 0 };
    }

    const values: (string | number)[] = [];

    const placeholders = courseLinks
      .map(
        ({
          class: cls,
          url,
          date,
          title,
          year,
          teacher,
          group,
          codeLesson,
        }) => {
          values.push(cls, url, date, title, year, teacher, group, codeLesson);
          return `(?, ?, ?, ?, ?, ?, ?, ?)`;
        }
      )
      .join(", ");

    const query = `
      INSERT IGNORE INTO course_links (class, url, date, title, year, teacher, \`group\`, codeLesson)
      VALUES ${placeholders};
    `;

    const [result] = await pool.query(query, values);

    if ((result as AddCoursesStatus).affectedRows > 0) {
      Application.updateLessonsState();
    }

    console.log("this is result:\n", result);

    return result as AddCoursesStatus;
  }

  static async getCourses() {
    const [result] = await pool.query(
      `SELECT DISTINCT codeLesson, title FROM course_links` //
    );

    return result as ResultGetCourses;
  }

  static async getCourseFormation(codeLesson: string) {
    const [result] = await pool.query(
      `SELECT DISTINCT year, \`group\`, teacher ,codeLesson FROM course_links WHERE codeLesson = ? ;`,
      [codeLesson.trim()] //
    );

    return result as ResultGetCourseFormation;
  }
  static async getCourseSessions(
    codeLesson: string,
    year: string,
    group: string
  ) {
    const [result] = await pool.query(
      `SELECT date, url ,class FROM course_links WHERE codeLesson = ? AND year = ? AND \`group\` = ?  ORDER BY class ASC ;`,
      [codeLesson.trim(), year.trim(), group.trim()] //
    );

    return result as ResultGetCourseSessions;
  }
}

export default LessonsModel;
