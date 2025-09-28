// Тест API формы свадебного приглашения
const fetch = require('node-fetch');

async function testAPI() {
    const baseURL = 'https://wedding-invitation-backend-lj0d.onrender.com';
    
    console.log('🧪 Тестирование Wedding Invitation API\n');
    
    // 1. Проверка health check
    console.log('1. 🏥 Проверка здоровья сервера...');
    try {
        const healthResponse = await fetch(`${baseURL}/api/health`);
        const healthData = await healthResponse.json();
        console.log('   ✅ Сервер работает:', healthData.status);
        console.log('   ⏰ Время работы:', Math.floor(healthData.uptime), 'секунд');
    } catch (error) {
        console.log('   ❌ Ошибка health check:', error.message);
        return;
    }
    
    // 2. Тест валидации форм
    console.log('\n2. 📝 Тестирование валидации форм...');
    
    const testCases = [
        {
            name: 'Тест валидного запроса',
            data: {
                name: 'Анна Петрова',
                attendance: 'Буду присутствовать',
                wishes: 'Поздравляю с этим прекрасным днем!'
            },
            expectedStatus: 200
        },
        {
            name: 'Тест с коротким именем',
            data: {
                name: 'А',
                attendance: 'Буду присутствовать',
                wishes: 'Тест'
            },
            expectedStatus: 400
        },
        {
            name: 'Тест с неправильным статусом',
            data: {
                name: 'Иван Иванов',
                attendance: 'Возможно приду',
                wishes: 'Тест'
            },
            expectedStatus: 400
        },
        {
            name: 'Тест с именем с акцентом',
            data: {
                name: 'José García',
                attendance: 'Не смогу присутствовать',
                wishes: 'Извините, не смогу быть'
            },
            expectedStatus: 200
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n   🔸 ${testCase.name}`);
        
        try {
            const response = await fetch(`${baseURL}/api/submit-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-test-mode': 'true'  // Включаем тестовый режим
                },
                body: JSON.stringify(testCase.data)
            });
            
            const responseData = await response.json();
            
            if (response.status === testCase.expectedStatus) {
                console.log(`     ✅ Статус: ${response.status} (ожидался: ${testCase.expectedStatus})`);
                if (responseData.success) {
                    console.log('     ✅ Успешно:', responseData.message);
                } else if (responseData.errors) {
                    console.log('     ✅ Ошибки валидации (ожидалось):', responseData.errors.map(e => e.msg).join(', '));
                }
            } else {
                console.log(`     ❌ Неожиданный статус: ${response.status} (ожидался: ${testCase.expectedStatus})`);
                console.log('     📄 Ответ:', responseData);
            }
            
        } catch (error) {
            console.log(`     ❌ Ошибка запроса: ${error.message}`);
        }
        
        // Небольшая пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ Тестирование завершено!');
}

// Запуск тестов
testAPI().catch(console.error);