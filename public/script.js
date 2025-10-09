// Мок-функции для демонстрации (заменят API-запросы)
function generateMockPlan(businessType, targetAudience) {
    const plans = {
        "кафе": `📅 КОНТЕНТ-ПЛАН НА МЕСЯЦ - ${businessType.toUpperCase()}

НЕДЕЛЯ 1:
• Понедельник: Фото утреннего кофе с круассаном
• Вторник: Stories: "День в жизни бариста"
• Среда: Пост про новое блюдо в меню
• Четверг: Опрос "Ваш любимый десерт?"
• Пятница: Фото уютного интерьера кафе
• Суббота: Reels: процесс приготовления латте-арт
• Воскресенье: Отзывы довольных клиентов

НЕДЕЛЯ 2:
• Понедельник: Специальное предложение на завтраки
• Вторник: За кулисами: как готовятся десерты
• Среда: Пост про историю кафе
• Четверг: Интерактив "Угадай кофе по описанию"
• Пятница: Фото команды с рассказом о каждом
• Суббота: Прямой эфир с шеф-поваром
• Воскресенье: Carousel: топ-5 напитков сезона

НЕДЕЛЯ 3-4: Продолжение тематики с акцентом на сезонные блюда и события...`,

        "магазин": `📅 КОНТЕНТ-ПЛАН НА МЕСЯЦ - ${businessType.toUpperCase()}

НЕДЕЛЯ 1:
• Понедельник: Новые поступления товаров
• Вторник: Обзор трендовых позиций
• Среда: Отзывы покупателей с фото
• Четверг: Stories: скидки дня
• Пятница: Сравнение товаров "до/после"
• Суббота: Конкурс с призами
• Воскресенье: Лайфхаки использования товаров

И так далее...`,

        "default": `📅 КОНТЕНТ-ПЛАН НА МЕСЯЦ - ${businessType.toUpperCase()}

НЕДЕЛЯ 1:
• Понедельник: Знакомство с брендом/командой
• Вторник: Показ продукта/услуги
• Среда: Отзывы и кейсы клиентов
• Четверг: Полезный контент по теме
• Пятница: За кулисами работы
• Суббота: Развлекательный контент
• Воскресенье: Итоги недели

НЕДЕЛЯ 2-4: Развитие тематик с учетом аудитории ${targetAudience}...`
    };

    const key = businessType.toLowerCase().includes('кафе') ? 'кафе' : 
                businessType.toLowerCase().includes('магазин') ? 'магазин' : 'default';
    
    return plans[key];
}

function generateMockHashtags(postText) {
    const hashtagGroups = {
        "кафе": "#кафе #coffee #завтрак #уют #barista #латте #десерты #moscow #кофе #вкусно",
        "магазин": "#магазин #shopping #скидки #новинки #качество #доставка #товары #покупки #sale #онлайн",
        "красота": "#красота #beauty #макияж #косметика #уход #стиль #мода #бьюти #skincare #makeup",
        "фитнес": "#фитнес #спорт #тренировки #здоровье #фитнесмотивация #зож #тренер #спортзал #workout #fitness",
        "default": "#бизнес #качество #сервис #клиенты #профессионально #надежно #рекомендуем #топ #лучшие #проверено"
    };

    let selectedTags = hashtagGroups.default;
    
    for (let key in hashtagGroups) {
        if (postText.toLowerCase().includes(key)) {
            selectedTags = hashtagGroups[key];
            break;
        }
    }

    return `🏷️ РЕКОМЕНДУЕМЫЕ ХЕШТЕГИ:

Основные:
${selectedTags}

Дополнительные:
#контент #smm #продвижение #реклама #маркетинг

💡 Используйте 5-10 хештегов для лучшего охвата!`;
}

function generateMockAnalysis(profileUrl) {
    if (!profileUrl.includes('instagram.com')) {
        return "❌ Пожалуйста, введите корректную ссылку на Instagram";
    }

    return `📊 АНАЛИЗ КОНКУРЕНТА

👤 Профиль: ${profileUrl}

📈 Статистика:
• Подписчики: ~15,400
• Подписки: 1,200  
• Публикации: 847

📅 Активность:
• Постов в неделю: 4-6
• Лучшее время: 18:00-21:00
• Самый активный день: Суббота

🎯 Контент-стратегия:
• 40% - продуктовые фото
• 25% - lifestyle контент  
• 20% - отзывы клиентов
• 15% - образовательный контент

💡 Рекомендации:
1. Увеличить количество Stories
2. Добавить больше видео-контента
3. Чаще взаимодействовать с аудиторией
4. Использовать тренды и челленджи

⚠️ Примечание: Анализ основан на публичных данных`;
}

// Обновленные основные функции
async function generatePlan() {
    const businessType = document.getElementById('businessType').value.trim();
    const targetAudience = document.getElementById('targetAudience').value.trim();
    const resultDiv = document.getElementById('planResult');
    
    // Валидация
    if (!businessType || !targetAudience) {
        resultDiv.innerHTML = '<div class="error">❌ Заполните все поля</div>';
        return;
    }
    
    if (businessType.length > 100 || targetAudience.length > 100) {
        resultDiv.innerHTML = '<div class="error">❌ Текст слишком длинный (максимум 100 символов)</div>';
        return;
    }
    
    // Показать загрузку
    resultDiv.innerHTML = '<div class="loading">⏳ Генерируем контент-план...</div>';
    
    // Имитация задержки сервера
    setTimeout(() => {
        try {
            const plan = generateMockPlan(businessType, targetAudience);
            resultDiv.innerHTML = `<div class="success"><h3>📅 Ваш контент-план готов!</h3><pre>${plan}</pre></div>`;
        } catch (error) {
            resultDiv.innerHTML = '<div class="error">❌ Ошибка генерации плана</div>';
        }
    }, 1500);
}

async function generateHashtags() {
    const postText = document.getElementById('postText').value.trim();
    const resultDiv = document.getElementById('hashtagsResult');
    
    if (!postText) {
        resultDiv.innerHTML = '<div class="error">❌ Введите текст поста</div>';
        return;
    }
    
    if (postText.length > 500) {
        resultDiv.innerHTML = '<div class="error">❌ Текст слишком длинный (максимум 500 символов)</div>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">⏳ Подбираем хештеги...</div>';
    
    setTimeout(() => {
        try {
            const hashtags = generateMockHashtags(postText);
            resultDiv.innerHTML = `<div class="success">${hashtags}</div>`;
        } catch (error) {
            resultDiv.innerHTML = '<div class="error">❌ Ошибка подбора хештегов</div>';
        }
    }, 1000);
}

async function analyzeCompetitor() {
    const profileUrl = document.getElementById('profileUrl').value.trim();
    const resultDiv = document.getElementById('analysisResult');
    
    if (!profileUrl) {
        resultDiv.innerHTML = '<div class="error">❌ Введите ссылку на профиль</div>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">⏳ Анализируем конкурента...</div>';
    
    setTimeout(() => {
        try {
            const analysis = generateMockAnalysis(profileUrl);
            resultDiv.innerHTML = `<div class="success"><pre>${analysis}</pre></div>`;
        } catch (error) {
            resultDiv.innerHTML = '<div class="error">❌ Ошибка анализа профиля</div>';
        }
    }, 2000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('SMM Помощник загружен');
    
    // Инициализация Telegram WebApp если доступен
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
});
