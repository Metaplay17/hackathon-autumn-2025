
// Для локального JSON файла
async function ParsingJSON(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
    }
}

export default ParsingJSON;