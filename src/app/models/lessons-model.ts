import pool from "../../utils/mysql-database";

interface AddCoursesStatus {
  affectedRows: number;
}
import { courseLink } from "../router/lessons";

class LessonsModel {
  static async addCourses(courseLinks: courseLink[]) {
    if (courseLinks.length === 0) {
      return {
        affectedRows: 0,
      };
    }
    const values = courseLinks
      .map(
        ({ class: cls, url, date, title, year, teacher, group, codeLesson }) =>
          `(${cls}, '${url}', '${date}', '${title}', '${year}', '${teacher}', '${group}', '${codeLesson}')`
      )
      .join(", ");

    const query = `
        INSERT IGNORE INTO course_links (class, url, date, title, year, teacher, \`group\`, codeLesson)
        VALUES ${values};
    `;
    const [result] = await pool.query(query);

    return result as AddCoursesStatus;
  }
}
export default LessonsModel;
