# Shiraz University Class Download - Backend

این پروژه یک API برای مدیریت لینک‌های دانلود کلاس‌های دانشگاه شیراز است. در اینجا توضیحاتی درباره‌ی راه‌اندازی پروژه، ساختار دیتابیس و نحوه‌ی استفاده از آن ارائه شده است.

## 📌 پیش‌نیازها

برای اجرای این پروژه، به موارد زیر نیاز دارید:

- Express 
- MySQL
- یک ویرایشگر مانند VS Code

## 🚀 نصب و راه‌اندازی

ابتدا مخزن را کلون کنید:
```sh
git clone https://github.com/AbolfazlKhosravi/backEnd-shiraz-university-class-download-.git
```

### ۱. نصب وابستگی‌ها

```sh
npm install
```

### ۲. تنظیم فایل محیطی `.env`

یک فایل `.env` در پوشه‌ی `backEnd` ایجاد کنید و اطلاعات دیتابیس را اضافه کنید:
```env
APP_PORT=?
NODE_ENV=?
ALLOW_CORS_ORIGIN=?
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD=?
DB_DATABASE="freelancering_app"
DOMAIN=localhost
```

### ۳. ساخت دیتابیس و جداول

ابتدا دیتابیس را ایجاد کنید:
```sql
CREATE SCHEMA shiraz_university_courses DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
```

سپس جداول مورد نیاز را اضافه کنید:
```sql
CREATE TABLE `course_links` (
  `class` int NOT NULL,
  `url` varchar(355) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codeLesson` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`class`,`year`,`group`,`codeLesson`),
  UNIQUE KEY `url_UNIQUE` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

### ۴. اجرای سرور

```sh
npm start
```
یا برای حالت توسعه:
```sh
npm run dev
```

## 🛠 API Endpoints

### **۱. افزودن لینک‌های دوره**
**POST** `/api/lessons/addCourses`
```json
{
  "courseLinks": [
    {
      "class": 1,
      "url": "https://offline.shirazu.ac.ir/14031/pel3w5481ka3.zip",
      "date": "۱۴۰۳/۱۱/۲۰",
      "title": "معماري كامپيوتر",
      "year": "دوم - ۱۴۰۳",
      "teacher": "زارعي",
      "group": "1",
      "codeLesson": "۲۷۰۵۳۰۱۵۱"
    }
  ]
}
```

## 📌 نکات مهم
- برای جلوگیری از ورود داده‌های تکراری، از `INSERT IGNORE` در MySQL استفاده شده است که بررسی را فقط بر اساس `PRIMARY KEY` انجام می‌دهد.
- تمامی داده‌ها با `UTF-8` ذخیره شوند تا از مشکلات مربوط به کاراکترهای فارسی جلوگیری شود.

---

✨ پروژه‌ی شما آماده است! حالا می‌توانید از API استفاده کنید. 🚀

