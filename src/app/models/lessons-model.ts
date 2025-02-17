import pool from "../../utils/mysql-database";
import { courseLink } from "../router/lessons";
interface AddCoursesStatus {
  affectedRows: number;
}

type ResultGetCourses = {
  title: string;
  codeLesson: string;
}[];

type ResultGetCourseFormation = {
  year: string;
  group: string;
  teacher: string;
  codeLesson: string;
}[];
type ResultGetCourseSessions = {
  date: string;
  url: string;
  class: number;
}[];

class LessonsModel {
  static async addCourses(courseLinks: courseLink[]) {
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
    teacher: string,
    year: string,
    group: string
  ) {
    const [result] = await pool.query(
      `SELECT date, url ,class FROM course_links WHERE codeLesson = ? AND teacher = ? AND year = ? AND \`group\` = ?  ORDER BY class ASC ;`,
      [codeLesson.trim(), teacher.trim(), year.trim(), group.trim()] //
    );

    return result as ResultGetCourseSessions;
  }
}

export default LessonsModel;
