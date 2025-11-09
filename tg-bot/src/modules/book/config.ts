import { TModuleConfig } from "@/types/TModule";

export const bookConfig: TModuleConfig = {
    commandName: '/book', 
    commandDescription: 'Забронировать команту'
}

export const chooseRoom: TModuleConfig = {
    commandName: 'book_room',
    commandDescription: 'Выбор комнаты для бронирования'
}

export const chooseFloor: TModuleConfig = {
    commandName: 'floor', 
    commandDescription: 'Выбор этажа'
}
