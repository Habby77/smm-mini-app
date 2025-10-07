// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Настройка темы и интерфейса
document.addEventListener('DOMContentLoaded', function() {
    // Уведомляем Telegram, что приложение готово
    tg.ready();
    
    // Расширяем приложение на весь экран
    tg.expand();
    
    // Настраиваем основную кнопку
    tg.MainButton.text = "Закрыть приложение";
    tg.MainButton.show();
    tg.MainButton.onClick(() => tg.close());
    
    // Показываем информацию о пользователе
    console.log('Пользователь Telegram:', tg.initDataUnsafe?.user);
    
    // Проверяем оставшиеся бесплатные запросы
    checkUserLimits();
});

// Глобальные переменные
let userRequests = {
    daily: 0,
    limit: 3
};

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Добавляем стили для уведомлений
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1001;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 90%;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Функция проверки лимитов пользователя
function checkUserLimits() {
    // В реальном приложении здесь будет запрос к серверу
    const today = new Date().toDateString();
    const stored = localStorage.getItem('userRequests');
    
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
            userRequests.daily = data.count;
        } else {
            userRequests.daily = 0;
        }
    }
    
    // Обновляем счетчик в интерфейсе
    const counter = document.getElementById('free-requests');
    if (counter) {
        counter.textContent = Math.max(0, userRequests.limit - userRequests.daily);
    }
}

// Функция для увеличения счетчика запросов
function incrementRequestCount() {
    userRequests.daily++;
    
    // Сохраняем в localStorage
    const today = new Date().toDateString();
    localStorage.setItem('userRequests', JSON.stringify({
        date: today,
        count: userRequests.daily
    }));
    
    // Обновляем интерфейс
    checkUserLimits();
}

// Функция проверки лимита запросов
function canMakeRequest() {
    return userRequests.daily < userRequests.limit;
}

// Показать/скрыть loader
function showLoader() {
    document.getElementById('loading-modal').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loading-modal').style.display = 'none';
}

// Генератор контент-плана
async function generateContentPlan() {
    const businessType = document.getElementById('business-type').value.trim();
    const targetAudience = document.getElementById('target-audience').value.trim();
    
    // Проверяем заполненность полей
    if (!businessType) {
        showNotification('Пожалуйста, укажите тип бизнеса', 'error');
        return;
    }
    
    if (!targetAudience) {
        showNotification('Пожалуйста, укажите целевую аудиторию', 'error');
        return;
    }
    
    // Проверяем лимит запросов
    if (!canMakeRequest()) {
        showNotification('Исчерпан лимит бесплатных запросов. Оформите подписку!', 'error');
        showSubscriptionModal();
        return;
    }
    
    showLoader();
    
    try {
        // Отправляем запрос на сервер
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                businessType: businessType,
                targetAudience: targetAudience,
                userId: tg.initDataUnsafe?.user?.id || 'demo'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayContentPlan(data.plan);
            incrementRequestCount();
            showNotification('Контент-план успешно создан!', 'success');
        } else {
            throw new Error(data.message || 'Ошибка при генерации контент-плана');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Произошла ошибка. Попробуйте позже.', 'error');
        
        // Показываем демо-данные для тестирования
        displayDemoContentPlan(businessType, targetAudience);
        incrementRequestCount();
        
    } finally {
        hideLoader();
    }
}

// Отображение результатов контент-плана
function displayContentPlan(plan) {
    const container = document.getElementById('results-container');
    
    let html = `
        <div class="result-card">
            <h4>📅 Контент-план на месяц</h4>
            <div class="content-plan-results">
    `;
    
    if (Array.isArray(plan)) {
        plan.forEach((item, index) => {
            html += `
                <div class="plan-item">
                    <strong>День ${index + 1}:</strong> ${item.idea}<br>
                    <div class="hashtags-list">
                        ${item.hashtags ? item.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
            `;
        });
    } else {
        html += `<p>${plan}</p>`;
    }
    
    html += `
            </div>
            <button class="btn-secondary" onclick="copyToClipboard('content-plan')">
                📋 Копировать план
            </button>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth' });
}

// Демо контент-план для тестирования
function displayDemoContentPlan(businessType, targetAudience) {
    const demoPlan = [
        {
            idea: `Расскажите историю создания вашего ${businessType}`,
            hashtags: ['#история', '#бизнес', '#начинали']
        },
        {
            idea: `Покажите процесс работы изнутри`,
            hashtags: ['#процесс', '#работа', '#качество']
        },
        {
            idea: `Отзывы довольных клиентов`,
            hashtags: ['#отзывы', '#клиенты', '#качество']
        },
        {
            idea: `Советы для ${targetAudience}`,
            hashtags: ['#советы', '#полезно', '#лайфхак']
        },
        {
            idea: `Акции и специальные предложения`,
            hashtags: ['#акция', '#скидка', '#предложение']
        }
    ];
    
    displayContentPlan(demoPlan);
}

// Генератор хештегов
async function generateHashtags() {
    const postText = document.getElementById('post-text').value.trim();
    
    if (!postText) {
        showNotification('Пожалуйста, введите текст поста', 'error');
        return;
    }
    
    if (!canMakeRequest()) {
        showNotification('Исчерпан лимит бесплатных запросов. Оформите подписку!', 'error');
        showSubscriptionModal();
        return;
    }
    
    showLoader();
    
    try {
        const response = await fetch('/api/generate-hashtags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postText: postText,
                userId: tg.initDataUnsafe?.user?.id || 'demo'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayHashtags(data.hashtags);
            incrementRequestCount();
            showNotification('Хештеги успешно подобраны!', 'success');
        } else {
            throw new Error(data.message || 'Ошибка при генерации хештегов');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        
        // Показываем демо-хештеги
        const demoHashtags = ['#контент', '#smm', '#маркетинг', '#бизнес', '#продвижение', '#реклама', '#соцсети', '#инстаграм', '#продажи', '#клиенты'];
        displayHashtags(demoHashtags);
        incrementRequestCount();
        
    } finally {
        hideLoader();
    }
}

// Отображение хештегов
function displayHashtags(hashtags) {
    const container = document.getElementById('results-container');
    
    let html = `
        <div class="result-card">
            <h4>#️⃣ Подобранные хештеги</h4>
            <div class="hashtags-list">
                ${hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
            </div>
            <button class="btn-secondary" onclick="copyHashtags()">
                📋 Копировать хештеги
            </button>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth' });
}

// Анализ конкурентов
async function analyzeCompetitor() {
    const competitorUrl = document.getElementById('competitor-url').value.trim();
    
    if (!competitorUrl) {
        showNotification('Пожалуйста, укажите ссылку на профиль конкурента', 'error');
        return;
    }
    
    if (!canMakeRequest()) {
        showNotification('Исчерпан лимит бесплатных запросов. Оформите подписку!', 'error');
        showSubscriptionModal();
        return;
    }
    
    showLoader();
    
    // Демо-анализ конкурента
    setTimeout(() => {
        const demoAnalysis = {
            followerCount: '12.5K',
            avgLikes: '145',
            topHashtags: ['#красота', '#косметика', '#уход', '#красиво', '#девочки'],
            postFrequency: '2-3 поста в день',
            bestTime: '18:00 - 21:00',
            contentTypes: ['Фото товаров', 'Stories с процессом', 'Отзывы клиентов']
        };
        
        displayCompetitorAnalysis(demoAnalysis);
        incrementRequestCount();
        hideLoader();
        showNotification('Анализ конкурента завершен!', 'success');
    }, 2000);
}

// Отображение анализа конкурентов
function displayCompetitorAnalysis(analysis) {
    const container = document.getElementById('results-container');
    
    let html = `
        <div class="result-card">
            <h4>📊 Анализ конкурента</h4>
            <div class="analysis-results">
                <p><strong>Подписчики:</strong> ${analysis.followerCount}</p>
                <p><strong>Средние лайки:</strong> ${analysis.avgLikes}</p>
                <p><strong>Частота постов:</strong> ${analysis.postFrequency}</p>
                <p><strong>Лучшее время:</strong> ${analysis.bestTime}</p>
                
                <p><strong>Популярные хештеги:</strong></p>
                <div class="hashtags-list">
                    ${analysis.topHashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
                </div>
                
                <p><strong>Типы контента:</strong></p>
                <ul>
                    ${analysis.contentTypes.map(type => `<li>${type}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth' });
}

// Копирование в буфер обмена
function copyToClipboard(type) {
    let textToCopy = '';
    
    if (type === 'content-plan') {
        const planItems = document.querySelectorAll('.plan-item');
        planItems.forEach(item => {
            textToCopy += item.textContent.trim() + '\n\n';
        });
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Скопировано в буфер обмена!', 'success');
    }).catch(() => {
        showNotification('Ошибка копирования', 'error');
    });
}

// Копирование хештегов
function copyHashtags() {
    const hashtags = Array.from(document.querySelectorAll('.hashtags-list .hashtag'))
        .map(tag => tag.textContent)
        .join(' ');
        
    navigator.clipboard.writeText(hashtags).then(() => {
        showNotification('Хештеги скопированы!', 'success');
    }).catch(() => {
        showNotification('Ошибка копирования', 'error');
    });
}

// Модальные окна
function showSubscriptionModal() {
    document.getElementById('subscription-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function selectPlan(planType) {
    showNotification(`Выбран план: ${planType}. Перенаправляем на оплату...`, 'info');
    
    // В реальном приложении здесь будет редирект на платежную систему
    setTimeout(() => {
        closeModal('subscription-modal');
        // Имитируем успешную оплату для демо
        if (confirm('Это демо-версия. Активировать PRO доступ для тестирования?')) {
            userRequests.limit = 1000;
            showNotification('PRO доступ активирован!', 'success');
            checkUserLimits();
        }
    }, 1500);
}

// Закрытие модальных окон по клику вне них
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Обработка кнопки "назад" в Telegram
tg.BackButton.onClick(() => {
    if (document.querySelector('.modal[style*="block"]')) {
        // Если открыто модальное окно, закрываем его
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    } else {
        // Иначе закрываем приложение
        tg.close();
    }
});