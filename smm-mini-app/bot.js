const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Создаем экземпляр бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// URL веб-приложения (пока оставляем локальный для тестирования)
const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:3000';

// Стартовое сообщение и меню
bot.command('start', async (ctx) => {
    const firstName = ctx.from.first_name || 'друг';
    
    await ctx.replyWithPhoto(
        { url: 'https://i.imgur.com/placeholder.jpg' }, // Позже добавим реальное изображение
        {
            caption: `🚀 Привет, ${firstName}!

Добро пожаловать в **SMM Помощник Про** — твой персональный ИИ-ассистент для автоматизации SMM-задач!

🎯 **Что я умею:**
• Создавать контент-планы на месяц
• Подбирать релевантные хештеги  
• Анализировать конкурентов
• Генерировать идеи для постов

💎 **Бесплатно:** 3 запроса в день
🚀 **PRO:** безлимитный доступ

Нажми кнопку ниже, чтобы начать!`,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '📱 Открыть SMM Помощник',
                            web_app: { url: webAppUrl }
                        }
                    ],
                    [
                        { text: '💎 PRO Подписка', callback_data: 'subscription' },
                        { text: '❓ Помощь', callback_data: 'help' }
                    ]
                ]
            }
        }
    );
});

// Обработка команды /help
bot.command('help', async (ctx) => {
    await ctx.reply(`❓ **Помощь по SMM Помощнику**

🔥 **Основные функции:**
/start - запустить приложение
/stats - статистика использования
/subscription - информация о подписке

💡 **Как пользоваться:**
1. Нажми "Открыть SMM Помощник"
2. Выбери нужную функцию
3. Заполни поля и получи результат

📞 **Поддержка:** @your_support_bot

✨ **Версия:** 1.0.0`, 
        { parse_mode: 'Markdown' }
    );
});

// Обработка команды статистики
bot.command('stats', async (ctx) => {
    const userId = ctx.from.id;
    
    // В реальном приложении здесь будет запрос к БД
    const stats = {
        totalRequests: 15,
        todayRequests: 2,
        planGenerated: 3,
        hashtagsGenerated: 8,
        competitorsAnalyzed: 4
    };
    
    await ctx.reply(`📊 **Ваша статистика**

🎯 **Всего запросов:** ${stats.totalRequests}
📅 **Сегодня:** ${stats.todayRequests}/3

📝 **Контент-планов:** ${stats.planGenerated}
#️⃣ **Хештегов:** ${stats.hashtagsGenerated}  
📊 **Анализов:** ${stats.competitorsAnalyzed}

💎 Хотите больше? Оформите PRO подписку!`,
        { 
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    { text: '💎 Получить PRO', callback_data: 'subscription' }
                ]]
            }
        }
    );
});

// Обработка callback-кнопок
bot.on('callback_query', async (ctx) => {
    const action = ctx.callbackQuery.data;
    
    switch (action) {
        case 'subscription':
            await ctx.editMessageText(`💎 **PRO Подписка**

🚀 **Базовый план - 490₽/месяц**
• 50 запросов в день
• Все функции
• Поддержка в чате

💎 **PRO план - 990₽/месяц**
• Безлимитные запросы
• Приоритетная поддержка
• Экспорт в Excel
• Новые функции первыми

🏢 **Агентство - 2490₽/месяц**
• Все из PRO
• API доступ
• Белая метка
• Персональный менеджер`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '💳 Базовый 490₽', url: 'https://your-payment-link.com/basic' },
                                { text: '💎 PRO 990₽', url: 'https://your-payment-link.com/pro' }
                            ],
                            [
                                { text: '🏢 Агентство 2490₽', url: 'https://your-payment-link.com/agency' }
                            ],
                            [
                                { text: '← Назад', callback_data: 'back_to_main' }
                            ]
                        ]
                    }
                }
            );
            break;
            
        case 'help':
            await ctx.editMessageText(`❓ **Частые вопросы**

**Q: Как работает генерация контента?**
A: Используем ИИ для анализа вашей ниши и создания релевантного контента

**Q: Можно ли отменить подписку?**
A: Да, в любой момент через меню подписки

**Q: Есть ли мобильное приложение?**
A: Наше приложение работает прямо в Telegram!

**Q: Как связаться с поддержкой?**
A: Напишите @your_support_bot`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '← Назад', callback_data: 'back_to_main' }
                        ]]
                    }
                }
            );
            break;
            
        case 'back_to_main':
            // Возвращаем к стартовому сообщению
            await ctx.editMessageText(`🚀 **SMM Помощник Про**

Выберите действие:`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '📱 Открыть приложение',
                                    web_app: { url: webAppUrl }
                                }
                            ],
                            [
                                { text: '💎 PRO Подписка', callback_data: 'subscription' },
                                { text: '❓ Помощь', callback_data: 'help' }
                            ]
                        ]
                    }
                }
            );
            break;
    }
    
    await ctx.answerCbQuery();
});

// Обработка сообщений с веб-приложением
bot.on('web_app_data', async (ctx) => {
    const data = JSON.parse(ctx.webAppData.data);
    
    await ctx.reply(`✅ Получены данные из приложения: ${JSON.stringify(data)}`);
});

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error('Ошибка в боте:', err);
    ctx.reply('Произошла ошибка. Попробуйте позже.');
});

// Запуск бота
if (require.main === module) {
    bot.launch()
        .then(() => console.log('🤖 Бот запущен!'))
        .catch(err => console.error('Ошибка запуска бота:', err));
    
    // Graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

module.exports = bot;