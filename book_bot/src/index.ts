import 'module-alias/register';
import { bot, botCommandsInfo, db} from "./app";
import { callbackQueryHandler, commandHandler } from "./habdlers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

dayjs.locale('ru')
dayjs.tz.setDefault('Europe/Moscow');

const startBot = async () => {
  try {

    db.connect();

    bot.setMyCommands(botCommandsInfo);

    bot.on('message', message => {
      return commandHandler(bot, message)
    })
    bot.on('callback_query', message => {
      return callbackQueryHandler(bot, message)
    })


  } catch (e) {
    console.log(e)
  }
}

startBot();