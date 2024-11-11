function formatWithCase(value: string, token: string): string {
    if (token === token.toUpperCase()) {
        return value.toUpperCase(); // Все капсом
    } else if (token[0] === token[0].toUpperCase()) {
        return value.charAt(0).toUpperCase() + value.slice(1); // Первая буква заглавная
    }
    return value; // Никаких изменений
}

//В каждой группе токены должны быть указаны от самых длинных к самым коротким 
const parts = [
    "dddd", // Полное название дня недели, например 'вторник'
    "ddd",  // Сокращенное название дня недели, например 'вт'
    "dd",   // День месяца с ведущим нулем, например '05'
    "d",    // День месяца без ведущего нуля, например '5'

    "mmmm", // Полное название месяца, например 'Ноябрь'
    "mmm",  // Аббревиатура месяца, например 'Ноя'
    "mm",   // Месяц с ведущим нулем, например '11'
    "m",    // Месяц без ведущего нуля, например '11'

    "yyyy", // Полный год, например '2024'
    "yy",   // Последние две цифры года, например '24'

    "hh24", // Часы в 24-часовом формате с ведущим нулем, например '07'
    "h24",  // Часы в 24-часовом формате без ведущего нуля, например '7'
    "hh12", // Часы в 12-часовом формате с ведущим нулем, например '07'
    "h12",  // Часы в 12-часовом формате без ведущего нуля, например '7'

    "min",   // Минуты с ведущим нулем, например '03'
    "mi",    // Минуты без ведущего нуля, например '3'

    "ss",   // Секунды с ведущим нулем, например '09'
    "s",    // Секунды без ведущего нуля, например '9'

    "ms",    // Миллисекунды с ведущими нулями до трех символов, например '004'

    "gmt",   // Часовой пояс, например 'UTC+3'
    "zt",     // Зона времени, например Moscow

] as const

const now = ["now", "*", "_"] as const;

type FormatOptions = {
    template?: string;
};

// TODO: add support select timezone 
export function createDate(date?: string | Date | number | typeof now[number], locale?: string) {
    if (date === undefined || now.includes(date as any)) {
        date = new Date();
    } else {
        date = new Date(date);
    }

    const language = locale;

    const map: Record<typeof parts[number], string> = {
        d: date.getDate().toString(),
        dd: date.getDate().toString().padStart(2, "0"),
        ddd: new Intl.DateTimeFormat(language, { weekday: 'short' }).format(date),
        dddd: new Intl.DateTimeFormat(language, { weekday: 'long' }).format(date),

        m: (date.getMonth() + 1).toString(),
        mm: (date.getMonth() + 1).toString().padStart(2, "0"),
        mmm: new Intl.DateTimeFormat(language, { month: 'short' }).format(date).slice(0, -1),
        mmmm: new Intl.DateTimeFormat(language, { month: 'long' }).format(date),

        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear().toString(),

        h12: ((date.getHours() + 11) % 12 + 1).toString(),
        hh12: ((date.getHours() + 11) % 12 + 1).toString().padStart(2, "0"),
        h24: date.getHours().toString(),
        hh24: date.getHours().toString().padStart(2, "0"),

        mi: date.getMinutes().toString(),
        min: date.getMinutes().toString().padStart(2, "0"),

        ss: date.getSeconds().toString().padStart(2, "0"),
        s: date.getSeconds().toString(),

        ms: date.getMilliseconds().toString().padStart(3, "0"),

        zt: (() => {
            const timeZoneString = new Intl.DateTimeFormat(language, { timeZoneName: 'shortGeneric' }).format(date);

            const timeZoneParts = timeZoneString.split(','); // Разбиваем строку на части
            delete timeZoneParts[0]
            const zone = timeZoneParts.join("").trim(); // Берем последний элемент, который содержит только часовой пояс

            if (zone === "Moscow") return "Москва"

            return zone
        })(),
        gmt: (() => {
            const timeZoneString = new Intl.DateTimeFormat(language, { timeZoneName: 'longOffset' }).format(date);

            const timeZoneParts = timeZoneString.split(','); // Разбиваем строку на части
            delete timeZoneParts[0]
            return timeZoneParts.join("").trim(); // Берем последний элемент, который содержит только часовой пояс
        })(),
    }

    // Функция для разбора шаблона с учетом токенов %...% и строгой проверки токенов с конца
    function parseTemplate(template: string): string[] {
        const tokens: string[] = [];
        let i = template.length;

        while (i > 0) {
            // Проверяем, начинается ли текст с "%", указывающий текст внутри процента
            if (template[i - 1] === "%" && template.lastIndexOf("%", i - 2) !== -1) {
                const start = template.lastIndexOf("%", i - 2);
                tokens.unshift(template.slice(start, i)); // Добавляем текст в процентах как отдельный токен
                i = start;
                continue;
            }

            let found = false;
            // Проверяем токены строго по длине и с конца строки
            for (const part of parts) {
                const originalToken = template.slice(i - part.length, i)
                const lowToken = template.slice(i - part.length, i).toLowerCase()

                if (lowToken === part) {
                    tokens.unshift(originalToken);
                    i -= part.length;
                    found = true;
                    break;
                }
            }

            // Если токен не найден, значит это одиночный символ
            if (!found) {
                tokens.unshift(template[i - 1]);
                i--;
            }
        }

        return tokens;
    }

    return {
        format(template?: FormatOptions["template"]) {
            template = template || "dd.mm.yyyy hh24:mi:ss";
            const tokens = parseTemplate(template)

            const formattedParts = tokens.map((part) => {
                const match = (map as any)[part.toLowerCase()] as string | undefined
                if (match) {
                    return formatWithCase(match, part)
                } else {
                    return part.startsWith("%") && part.endsWith("%") ? part.slice(1, -1) : part;
                }
            });

            return formattedParts.join("");
        }
    };
}

//const niceTemplate = "Ddd dd Mmm yyyy год %nice day ;)% h24 часов min минут ss секунд zt gmt";
//const badTemplate = "ddd dd mmm yyyy год nice day ;) h24 часов min минут ss секунд zt gmt";
//console.log("шаблон:", niceTemplate);
//console.log("результат:", createDate("*", "ru").format(niceTemplate));