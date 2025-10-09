// Добавим в начало server.js
const logger = require('./logger');

// В обработчиках добавим логирование
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { businessType, targetAudience, userId } = req.body;
        
        logger.info('Запрос на генерацию плана', { 
            businessType, 
            targetAudience, 
            userId,
            ip: req.ip 
        });
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Создаем Express приложение
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API для генерации контент-плана
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { businessType, targetAudience, userId } = req.body;
        
        console.log('Запрос на генерацию плана:', { businessType, targetAudience, userId });
        
        // Проверяем входные данные
        if (!businessType || !targetAudience) {
            return res.status(400).json({
                success: false,
                message: 'Не заполнены обязательные поля'
            });
        }
        
        // Имитируем генерацию контент-плана
        const contentPlan = await generateContentPlanDemo(businessType, targetAudience);
        
        res.json({
            success: true,
            plan: contentPlan
        });
        
    } catch (error) {
        console.error('Ошибка генерации контент-плана:', error);
        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера'
        });
    }
});

// API для генерации хештегов
app.post('/api/generate-hashtags', async (req, res) => {
    try {
        const { postText, userId } = req.body;
        
        console.log('Запрос на генерацию хештегов:', { postText, userId });
        
        if (!postText) {
            return res.status(400).json({
                success: false,
                message: 'Текст поста не может быть пустым'
            });
        }
        
        // Имитируем генерацию хештегов
        const hashtags = await generateHashtagsDemo(postText);
        
        res.json({
            success: true,
            hashtags: hashtags
        });
        
    } catch (error) {
        console.error('Ошибка генерации хештегов:', error);
        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера'
        });
    }
});

// API для анализа конкурентов
app.post('/api/analyze-competitor', async (req, res) => {
    try {
        const { competitorUrl, userId } = req.body;
        
        console.log('Запрос на анализ конкурента:', { competitorUrl, userId });
        
        if (!competitorUrl) {
            return res.status(400).json({
                success: false,
                message: 'URL конкурента обязателен'
            });
        }
        
        // Имитируем анализ конкурента
        const analysis = await analyzeCompetitorDemo(competitorUrl);
        
        res.json({
            success: true,
            analysis: analysis
        });
        
    } catch (error) {
        console.error('Ошибка анализа конкурента:', error);
        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера'
        });
    }
});

// API для проверки статуса пользователя
app.get('/api/user/:userId/status', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // В реальном приложении здесь будет запрос к базе данных
        const userStatus = {
            id: userId,
            subscription: 'free',
            dailyRequests: 1,
            limit: 3,
            remainingRequests: 2
        };
        
        res.json({
            success: true,
            status: userStatus
        });
        
    } catch (error) {
        console.error('Ошибка получения статуса пользователя:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка получения статуса пользователя'
        });
    }
});

// Демо функции для имитации AI

// Генератор контент-плана (демо)
async function generateContentPlanDemo(businessType, targetAudience) {
    // Имитируем задержку AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const ideas = [
        `Покажите, как создается ваш продукт в ${businessType}`,
        `История успеха клиентов из категории "${targetAudience}"`,
        `5 секретов качественного сервиса в сфере ${businessType}`,
        `Ошибки, которых стоит избегать ${targetAudience}`,
        `Экскурсия по вашему ${businessType} - закулисье`,
        `Топ-3 тренда в индустрии для ${targetAudience}`,
        `Отвечаем на частые вопросы от ${targetAudience}`,
        `Специальное предложение для ${targetAudience}`,
        `Сравнение: мы VS конкуренты`,
        `Полезные советы для ${targetAudience} от экспертов`,
        `Новинки и обновления в ${businessType}`,
        `Благодарности и отзывы довольных клиентов`,
        `Процесс работы с ${targetAudience} пошагово`,
        `Командный проект: знакомство с сотрудниками`,
        `Акция недели для ${targetAudience}`,
        `Лайфхаки для ${targetAudience} в сфере ${businessType}`,
        `Партнерские проекты и коллаборации`,
        `Статистика и достижения за месяц`,
        `Подготовка к сезонным изменениям`,
        `Персональные рекомендации для ${targetAudience}`,
        `Конкурс с призами для подписчиков`,
        `Обучающий контент по теме ${businessType}`,
        `Исследование потребностей ${targetAudience}`,
        `Презентация новой услуги/товара`,
        `Сравнительный анализ решений для ${targetAudience}`,
        `Успешные кейсы работы с ${targetAudience}`,
        `Планы развития ${businessType} на будущее`,
        `Эксклюзивный контент для VIP клиентов`,
        `Социальная ответственность бизнеса`,
        `Итоги месяца и планы на следующий`
    ];
    
    return ideas.map((idea, index) => ({
        day: index + 1,
        idea: idea,
        hashtags: generateHashtagsForIdea(idea, businessType, targetAudience),
        bestTime: generateRandomTime(),
        contentType: generateContentType()
    }));
}

// Генератор хештегов (демо)
async function generateHashtagsDemo(postText) {
    // Имитируем задержку AI
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Базовые хештеги
    const baseHashtags = ['#контент', '#smm', '#маркетинг', '#бизнес'];
    
    // Определяем тематику по ключевым словам
    const keywords = postText.toLowerCase();
    let thematicHashtags = [];
    
    if (keywords.includes('красота') || keywords.includes('косметика')) {
        thematicHashtags = ['#красота', '#косметика', '#уход', '#красиво', '#стиль'];
    } else if (keywords.includes('еда') || keywords.includes('кафе') || keywords.includes('ресторан')) {
        thematicHashtags = ['#еда', '#вкусно', '#кафе', '#ресторан', '#кухня'];
    } else if (keywords.includes('фитнес') || keywords.includes('спорт')) {
        thematicHashtags = ['#фитнес', '#спорт', '#здоровье', '#тренировки', '#мотивация'];
    } else if (keywords.includes('одежда') || keywords.includes('мода')) {
        thematicHashtags = ['#мода', '#стиль', '#одежда', '#образ', '#тренды'];
    } else {
        thematicHashtags = ['#качество', '#сервис', '#клиенты', '#услуги', '#профессионалы'];
    }
    
    // Популярные общие хештеги
    const popularHashtags = ['#moscow', '#спб', '#россия', '#инстаграм', '#лайк'];
    
    // Нишевые хештеги
    const nicheHashtags = ['#предложение', '#акция', '#новинка', '#эксклюзив', '#рекомендуем'];
    
    const allHashtags = [
        ...baseHashtags,
        ...thematicHashtags,
        ...popularHashtags.slice(0, 2),
        ...nicheHashtags.slice(0, 3)
    ];
    
    // Перемешиваем и возвращаем уникальные хештеги
    return [...new Set(allHashtags)].sort(() => Math.random() - 0.5);
}

// Анализ конкурентов (демо)
async function analyzeCompetitorDemo(url) {
    // Имитируем задержку анализа
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
        url: url,
        followers: Math.floor(Math.random() * 50000) + 1000,
        avgLikes: Math.floor(Math.random() * 500) + 50,
        avgComments: Math.floor(Math.random() * 50) + 5,
        postFrequency: getRandomFrequency(),
        bestPostTime: generateRandomTime(),
        topHashtags: generateTopHashtags(),
        contentTypes: [
            'Фото товаров/услуг',
            'Stories с процессом работы',
            'Отзывы клиентов',
            'Обучающий контент',
            'Личные посты команды'
        ],
        engagement: (Math.random() * 5 + 1).toFixed(1) + '%',
        recommendations: [
            'Увеличить частоту постинга в вечернее время',
            'Добавить больше пользовательского контента',
            'Использовать актуальные хештеги из анализа',
            'Улучшить качество визуала'
        ]
    };
}

// Вспомогательные функции
function generateHashtagsForIdea(idea, businessType, audience) {
    const hashtags = ['#контент', '#бизнес'];
    
    if (businessType) {
        hashtags.push(`#${businessType.replace(/\s+/g, '')}`);
    }
    
    if (audience) {
        hashtags.push('#клиенты');
    }
    
    hashtags.push('#качество', '#сервис');
    
    return hashtags.slice(0, 5);
}

function generateRandomTime() {
    const hours = [9, 12, 15, 18, 21];
    const hour = hours[Math.floor(Math.random() * hours.length)];
    return `${hour}:00`;
}

function generateContentType() {
    const types = ['Фото', 'Видео', 'Карусель', 'Stories'];
    return types[Math.floor(Math.random() * types.length)];
}

function getRandomFrequency() {
    const frequencies = ['1 пост в день', '2-3 поста в день', '1 пост через день', '4-5 постов в неделю'];
    return frequencies[Math.floor(Math.random() * frequencies.length)];
}

function generateTopHashtags() {
    const hashtags = ['#качество', '#сервис', '#клиенты', '#бизнес', '#профессионалы', '#рекомендуем', '#новинка', '#акция'];
    return hashtags.slice(0, 5);
}

// Обработка 404 ошибок
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint не найден'
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

// Запуск сервера
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
        console.log(`🌐 Приложение доступно по адресу: http://localhost:${PORT}`);
        console.log(`📱 Для Telegram Mini App используйте: ${process.env.WEBAPP_URL || `http://localhost:${PORT}`}`);
    });
}
} catch (error) {
        logger.error('Ошибка генерации плана', { 
            error: error.message, 
            stack: error.stack 
        });
        res.status(500).json({ 
            success: false, 
            error: 'Внутренняя ошибка сервера' 
        });
    }
});

module.exports = app;
