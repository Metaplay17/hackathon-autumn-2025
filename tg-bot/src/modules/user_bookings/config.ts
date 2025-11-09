import { TModuleConfig } from "@/types/TModule";

export const myBookingsConfig: TModuleConfig = {
    commandDescription: 'Ваши бронирования',
    commandName: '/my_bookings'
}

export const cancelBookingConfig: TModuleConfig = {
    commandName: 'cancel_booking',
    commandDescription: 'Удаление бронирования'
}

export const cancelConfig: TModuleConfig = {
    commandName: '/cancel',
    commandDescription: 'Отмена брони'
}