import { TChatData } from '@/types/TChat';
import { getAllRooms, Room, BookingSlot } from './service'; 
import { getToken } from '@/utils'; 
import { chooseFloor, chooseRoom } from './config';

interface BookingSession {
step: 'selecting_room' | 'selecting_date' | 'selecting_time' | 'selecting_duration' | 'confirming';
  selectedSlotId?: number; 
  selectedSlot?: any;
  currentFloor?: number; 
  selectedRoomId?: number;
  availableSlots?: BookingSlot[];
  selectedDate?: string;
}

export const bookingSessions = new Map<number, BookingSession>();

const getFloorBounds = (rooms: Room[]): { min: number; max: number } => {
  if (rooms.length === 0) return { min: 1, max: 1 };
  const floors = rooms.map(room => room.floor);
  return { min: Math.min(...floors), max: Math.max(...floors) };
};

export const handleStartBookingCommand = async (chat: TChatData, floor: number = 1): Promise<void> => {
  const { telegramId, chatId, bot } = chat;
  bookingSessions.delete(telegramId);
  try {
    const token = await getToken(telegramId);

    if (!token) {
      await bot.sendMessage(chatId, 'Токен авторизации отсутствует.');
      return;
    }

    const roomsData = await getAllRooms(token);

    if (!roomsData || roomsData.status !== 'OK') {
      await bot.sendMessage(chatId, 'Не удалось получить список комнат.');
      return;
    }

    const { min, max } = getFloorBounds(roomsData.rooms);

    if (floor < min || floor > max) {
      bookingSessions.delete(telegramId);
      await bot.sendMessage(chatId, `Недопустимый этаж. Доступные этажи: ${min}-${max}`);
      return;
    }

    const roomsOnFloor = roomsData.rooms.filter(room => room.floor === floor);

    const currentSession = bookingSessions.get(telegramId) || { step: 'selecting_room' as const };
    currentSession.currentFloor = floor;
    bookingSessions.set(telegramId, currentSession);
    currentSession.currentFloor = floor;

    if (roomsOnFloor.length === 0) {
      await bot.sendMessage(chatId, `На ${floor} этаже нет доступных комнат.`);
      return;
    }

    let fullMessage = `Комнаты на ${floor} этаже:\n\n`;
    const inlineKeyboard = [];

    for (const room of roomsOnFloor) {
      const roomInfo = formatRoomCaption(room);
      fullMessage += `${roomInfo}\n\n`; 
      
      const roomButtonRow = [
        { text: `Забронировать ${room.number}`, callback_data: `${chooseRoom.commandName}_id_${room.id}` }
      ];
      inlineKeyboard.push(roomButtonRow); 
    }

    let navigationRow;

    if (floor > 1 && floor < max){
        navigationRow = [
        { text: '← Этаж ', callback_data: `${chooseFloor.commandName}_id_${floor - 1}` },
        { text: 'Этаж →', callback_data: `${chooseFloor.commandName}_id_${floor + 1}` }
        ];
    }
    else if(floor === max){
        navigationRow = [{ text: '← Этаж ', callback_data: `${chooseFloor.commandName}_id_${floor - 1}` }];
    }
    else{ 
        navigationRow = [
        { text: 'Этаж →', callback_data: `${chooseFloor.commandName}_id_${floor + 1}` }
        ];
    }
    inlineKeyboard.push(navigationRow);

    await bot.sendMessage(chatId, fullMessage, {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });

  } catch (error) {
    console.error('Error in handleStartBookingCommand:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при начале бронирования.');
  }
};


export const handleFloorNavigation = async (chat: TChatData, newFloor: number): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    const token = await getToken(telegramId);
    if (!token) {
      await bot.sendMessage(chatId, 'Токен авторизации отсутствует.');
      return;
    }

    const roomsData = await getAllRooms(token);
    if (!roomsData || roomsData.status !== 'OK') {
      await bot.sendMessage(chatId, 'Не удалось получить список комнат.');
      return;
    }

    const { min, max } = getFloorBounds(roomsData.rooms);

    if (newFloor < min || newFloor > max) {
      return; 
    }

    await handleStartBookingCommand(chat, newFloor);

  } catch (error) {
    console.error('Error in handleFloorNavigation:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при навигации по этажам.');
  }
};

const formatRoomCaption = (room: Room): string => {
  const openStatus = room.open ? '✅ Открыта' : '❌ Закрыта';
  
  return `Комната: ${room.floor}-${room.number}
Описание: ${room.description}
Вместимость: ${room.capability} человек
Статус: ${openStatus}`;
};

function isValidImageBuffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  const signatures = [
    [0xFF, 0xD8, 0xFF], // JPEG
    [0x89, 0x50, 0x4E, 0x47], // PNG
    [0x47, 0x49, 0x46, 0x38], // GIF
    [0x42, 0x4D] // BMP
  ];
  for (const sig of signatures) {
    if (buffer[0] === sig[0] && buffer[1] === sig[1] && 
        (sig.length < 3 || buffer[2] === sig[2]) && 
        (sig.length < 4 || buffer[3] === sig[3])) {
      return true;
    }
  }
  return false;
}