// Мок-функции для демо-режима (пока нет бэкенда)
function generateMockPlan(businessType, targetAudience) {
    return `📅 КОНТЕНТ-ПЛАН НА МЕСЯЦ - ${businessType.toUpperCase()}

НЕДЕЛЯ 1:
• Понедельник: Знакомство с брендом/услугой
• Вторник: Демонстрация продукта в действии  
• Среда: Отзывы довольных клиентов
• Четверг: Полезные советы по теме
• Пятница: За кулисами вашей работы
• Суббота: Развлекательный контент
• Воскресенье: Подведение итогов недели

НЕДЕЛЯ 2:
• Понедельник: Специальное предложение
• Вторник: Сравнение "до/после"
• Среда: FAQ - отвечаем на вопросы
• Четверг: Интерактив с подписчиками
• Пятница: Команда и её история
• Суббота: Конкурс или розыгрыш
• Воскресенье: Планы на следующую неделю

НЕДЕЛИ 3-4: Развитие тематик с учётом аудитории ${targetAudience}...

💡 Адаптируйте контент под ваши цели и особенности бизнеса!`;
}

function generateMockHashtags(postText) {
    const commonTags = "#контент #smm #продвижение #маркетинг #бизнес #реклама #соцсети #инстаграм #продажи #клиенты";
    
    return `🏷️ РЕКОМЕНДУЕМЫЕ ХЕШТЕГИ:

Основные:
${commonTags}

Специализированные:
#качество #сервис #профессионально #надежно #рекомендуем

💡 Используйте 5-10 хештегов для оптимального охвата!`;
}

function generateMockAnalysis(profileUrl) {
    if (!profileUrl.includes('instagram.com')) {
        return "❌ Пожалуйста, введите корректную ссылку на Instagram профиль";
    }

    return `📊 АНАЛИЗ КОНКУРЕНТА

👤 Профиль: ${profileUrl}

📈 Основные метрики:
• Подписчики: ~12,500
• Активность: 3-4 поста в неделю
• Вовлечённость: 4.2%

🎯 Контент-стратегия:
• 35% - продуктовый контент
• 30% - образовательный  
• 20% - развлекательный
• 15% - пользовательский контент

⏰ Активность:
• Лучшее время постинга: 18:00-21:00
• Самые активные дни: Вт, Ср, Пт

💡 Рекомендации:
1. Добавить больше Stories
2. Увеличить интерактивность постов
3. Использовать тренды и актуальные хештеги

⚠️ Данные основаны на публичной информации`;
}

// Основные функции
async function generatePlan() {
    const businessType = document.getElementById('businessType').value.trim();
    const targetAudience = document.getElementById('targetAudience').value.trim();
    const resultDiv = document.getElementById('planResult');

    if (!businessType || !targetAudience) {
        resultDiv.innerHTML = '<div class="error">❌ Заполните все поля</div>';
        return;
    }

    resultDiv.innerHTML = '<div class="loading">⏳ Генерируем контент-план...</div>';

    // Имитация задержки сервера
    setTimeout(() => {
        const plan = generateMockPlan(businessType, targetAudience);
        resultDiv.innerHTML = `<div class="success"><pre>${plan}</pre></div>`;
    }, 1500);
}

async function generateHashtags() {
    const postText = document.getElementById('postText').value.trim();
    const resultDiv = document.getElementById('hashtagsResult');

    if (!postText) {
        resultDiv.innerHTML = '<div class="error">❌ Введите текст поста</div>';
        return;
    }

    resultDiv.innerHTML = '<div class="loading">⏳ Подбираем хештеги...</div>';

    setTimeout(() => {
        const hashtags = generateMockHashtags(postText);
        resultDiv.innerHTML = `<div class="success"><pre>${hashtags}</pre></div>`;
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
        const analysis = generateMockAnalysis(profileUrl);
        resultDiv.innerHTML = `<div class="success"><pre>${analysis}</pre></div>`;
    }, 2000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
});

async function fetchStats() {
  const url = document.getElementById('statsUrl').value.trim();
  const resultDiv = document.getElementById('statsResult');
  if (!url) {
    resultDiv.innerHTML = '<div class="error">❌ Введите ссылку на профиль</div>';
    return;
  }
  resultDiv.innerHTML = '<div class="loading">⏳ Загрузка статистики...</div>';
  try {
    const res = await fetch(`${API_BASE}/fetch-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileUrl: url })
    });
    const data = await res.json();
    if (data.success) {
      resultDiv.innerHTML = `
        <div class="success">
          Подписчики: ${data.stats.followers}<br>
          Подписки: ${data.stats.following}<br>
          Посты: ${data.stats.posts}
        </div>`;
    } else {
      resultDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
    }
  } catch {
    resultDiv.innerHTML = '<div class="error">❌ Ошибка сервера</div>';
  }
}

function generateCalendar() {
  const monthInput = document.getElementById('calendarMonth').value;
  const daysSelect = Array.from(document.getElementById('daysOfWeek').selectedOptions).map(o => parseInt(o.value));
  const topics = document.getElementById('topicsList').value.split(',').map(t => t.trim()).filter(Boolean);
  const resultDiv = document.getElementById('calendarResult');

  if (!monthInput || daysSelect.length === 0 || topics.length === 0) {
    resultDiv.innerHTML = '<div class="error">❌ Заполните все поля</div>';
    return;
  }

  resultDiv.innerHTML = '<div class="loading">⏳ Формируем календарь...</div>';

  setTimeout(() => {
    const [year, month] = monthInput.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const calendar = [];

    while (date.getMonth() === month - 1) {
      if (daysSelect.includes(date.getDay())) {
        const topic = topics[calendar.length % topics.length];
        calendar.push({ day: date.getDate(), topic });
      }
      date.setDate(date.getDate() + 1);
    }

    let html = '<table class="calendar-table"><tr><th>Дата</th><th>Тема</th></tr>';
    calendar.forEach(item => {
      html += `<tr><td>${year}-${String(month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}</td><td>${item.topic}</td></tr>`;
    });
    html += '</table>';

    resultDiv.innerHTML = `<div class="success">${html}</div>`;
  }, 500);
}
