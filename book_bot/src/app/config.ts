import TelegramBot from "node-telegram-bot-api";


import { EAppMode } from "../types/TApp";
import { startConfig } from "@/modules/general/start";
import { myBookingsConfig } from "@/modules/user_bookings";
import { bookConfig } from "@/modules/book";
import { cancelConfig } from "@/modules/user_bookings";

export const CURRENT_MODE: EAppMode = EAppMode.PROD
export const serverAdress = 'http://185.233.186.63'
export const config = {
  general: {
    [EAppMode.DEV]: {
      name: '@evgen_dev_bot',
      token: '7648324676:AAFyQSe5cnM4o_HWnE-L_KyNhf2W9u1RVog'
    },
    [EAppMode.PROD]: {
      name: '@cloudcom_booking_room_bot',
      token: '8492774603:AAF3-itmp9XUo4mqH19znxzKkSjK2RfOsp8'
    }
  },
}

export const bot = new TelegramBot(config.general[CURRENT_MODE].token, {polling: true});

export const botCommandsInfo: TelegramBot.BotCommand[] = [
 {
   command: startConfig.commandName,
   description: startConfig.commandDescription
 },
  {
   command: myBookingsConfig.commandName,
   description: myBookingsConfig.commandDescription
 },
  {
   command: bookConfig.commandName,
   description: bookConfig.commandDescription
 },
 {
  command: cancelConfig.commandName,
  description: cancelConfig.commandDescription
 }
]

