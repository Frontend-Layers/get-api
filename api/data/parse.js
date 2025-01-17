import fs from 'fs';

// Читаем исходный JSON файл
const inputFileName = 'funny.json';
const outputFileName = 'funny-1.json';

fs.readFile(inputFileName, 'utf-8', (err, data) => {
    if (err) {
        console.error(`Ошибка при чтении файла ${inputFileName}:`, err);
        return;
    }

    try {
        // Парсим содержимое файла
        const jsonData = JSON.parse(data);

        // Удаляем поле "name" из всех объектов верхнего уровня
        const updatedJson = Object.fromEntries(
            Object.entries(jsonData).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    const { name, ...rest } = value;
                    return [key, rest];
                }
                return [key, value];
            })
        );

        // Записываем обновлённый JSON в новый файл
        fs.writeFile(outputFileName, JSON.stringify(updatedJson, null, 2), (err) => {
            if (err) {
                console.error(`Ошибка при записи файла ${outputFileName}:`, err);
                return;
            }
            console.log(`Файл успешно сохранён в ${outputFileName}`);
        });
    } catch (parseError) {
        console.error('Ошибка при разборе JSON:', parseError);
    }
});