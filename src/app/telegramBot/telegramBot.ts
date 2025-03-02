import { Telegraf, Context, Markup } from "telegraf";
import Fuse, { FuseResult } from "fuse.js";
import { course } from "../models/lessons-model";
import { CallbackQuery, Message } from "telegraf/typings/core/types/typegram";
import Application from "../server";
import LessonsModel from "../models/lessons-model";

class TelegramBot {
  private bot!: Telegraf<Context>;
  private fuse!: Fuse<course>;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.initialize();
  }

  private async initialize() {
    if (Application.lessonsState.length === 0) {
      await Application.updateLessonsState();
    }
    const fuzeOptions = {
      keys: ["title"],
      includeScore: true,
      threshold: 0.4,
      maxResults: 5,
    };
    this.fuse = new Fuse(Application.lessonsState, fuzeOptions);

    this.bot.on("text", this.handleMessage.bind(this));

  }

  
  private handleMessage(ctx: Context): void | Promise<Message.TextMessage> {
    const query: string =
      (ctx.message as Message.TextMessage).text.trim() || "";
        
    if (!query) {
      return ctx.reply("لطفا یک کلمه برای جستجو وارد کنید");
    }

    else if (query === "/start") return ctx.reply("سلام به این ربات خوش اومدین😉. لطفا یک درس رو سرچ کنید تا نتایج رو ببینید!")

    const results: FuseResult<course>[] = this.fuse.search(query);

    if (results.length === 0) {
      return ctx.reply("متاسفانه موردی پیدا نشد");
    }

    const bestMatches: course[] = results.map(
      (
        result: FuseResult<course>
      ) => result.item
    );

    // make inline keyboard
    const inlineKeyboard = bestMatches.map((lesson) => {
      const callbackData = JSON.stringify({
        type: "Formation",
        codeLesson: lesson.codeLesson,
      });
      if (Buffer.byteLength(callbackData, "utf8") > 64) {
        console.error("Error: callback_data is too long!");
      }
      return [{ text: lesson.title, callback_data: callbackData }];
    });

    // Reply the nearest results with inline keyboard
    ctx.reply("نتایج نزدیک:", {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });

    // handle callbacks
    this.callbackHandler();
  }

  private callbackHandler() {
    this.bot.on("callback_query", async (ctx) => {
      console.log(`firstName: ${ctx.from.first_name}, userName:, ${ctx.from?.username}, "id:", ${ctx.from.id}`);
      const callbackData = JSON.parse(
        (ctx.callbackQuery as CallbackQuery.DataQuery).data
      );

      switch (callbackData.type) {
        case "Formation":
          const courseFormation = await LessonsModel.getCourseFormation(
            callbackData.codeLesson
          );
          const code = callbackData.codeLesson;
          const inlineKeyboard = courseFormation.map((course) => {
            const year = course.year;
            const group = course.group;
            const callbackData = JSON.stringify({
              type: "s",
              data: `${code}.${year}.${group}`,
            });
            return [
              {
                text: `سال و نیم سال: ${course.year}   .  گروه: ${course.group}`,
                callback_data: callbackData,
              },
            ];
          });
          ctx.reply(
            "لطفا سال، نیم سال تحصیلی و گروه مورد نظر را انتخاب کنید:",
            {
              reply_markup: {
                inline_keyboard: inlineKeyboard,
              },
            }
          );

          break;

        case "s":
          const data: Array<string> = callbackData.data.split(".");
          const codeLesson = data[0];
          const year = data[1];
          const group = data[2];
          const sessions = await LessonsModel.getCourseSessions(
            codeLesson,
            year,
            group
          );
          const inline_Keyboard = Markup.inlineKeyboard(
            sessions.map((session) => [
              Markup.button.url(
                `جلسه ${session.class},  ${session.date}`,
                session.url
              ),
            ])
          );
          ctx.reply("جلسات کلاس☺", inline_Keyboard);
          break;

        default:
          console.log("a callback that not handled");
          break;
      }

    });
  }

  public async start() {
    try {
      await this.bot.launch(() => console.log("Bot is running!"));
    } catch (error) {
      console.log("Telegram bot didn't launch:", error);
      setTimeout(() => this.start(), 5000);
    }
  }
}

export default TelegramBot;
