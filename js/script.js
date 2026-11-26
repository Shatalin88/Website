// ---------- Показ/скрытие поля темы доклада ----------

const reportYes  = document.getElementById('report-yes');
const reportNo   = document.getElementById('report-no');
const topicField = document.getElementById('topic-field');
const topicInput = document.getElementById('topic');

function toggleTopicField() {
    if (reportYes.checked) {
        topicField.hidden = false;
        topicInput.required = true;
    } else {
        topicField.hidden = true;
        topicInput.required = false;
        topicInput.value = '';
        clearError(topicInput, 'error-topic');
    }
}

reportYes.addEventListener('change', toggleTopicField);
reportNo.addEventListener('change', toggleTopicField);
toggleTopicField();

// ---------- Ссылки на элементы формы ----------

const form = document.getElementById('registration-form');
const result = document.getElementById('result');

const fullnameInput = document.getElementById('fullname');
const phoneInput    = document.getElementById('phone');
const emailInput    = document.getElementById('email');
const sectionInput  = document.getElementById('section');
const birthdateInput = document.getElementById('birthdate');

// ---------- Вспомогательные функции ----------

function setError(input, errorId, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    document.getElementById(errorId).textContent = message;
}

function clearError(input, errorId) {
    input.classList.remove('invalid');
    if (input.value.trim() !== '') {
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
    }
    document.getElementById(errorId).textContent = '';
}

// ---------- Правила валидации ----------

// ФИО: только кириллица, пробелы и дефисы; минимум три слова (фамилия, имя, отчество)
function validateFullname() {
    const value = fullnameInput.value.trim();
    const errorId = 'error-fullname';

    if (value === '') {
        setError(fullnameInput, errorId, 'Укажите ФИО полностью');
        return false;
    }
    if (!/^[А-Яа-яЁё\s-]+$/.test(value)) {
        setError(fullnameInput, errorId, 'Допустимы только буквы русского алфавита, пробел и дефис');
        return false;
    }
    const words = value.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 3) {
        setError(fullnameInput, errorId, 'Укажите полностью: фамилию, имя и отчество');
        return false;
    }
    clearError(fullnameInput, errorId);
    return true;
}

// Телефон: 11 цифр, первые две — "+7". Разделители (пробелы, скобки, дефисы) игнорируются.
// Телефон: ровно 11 цифр. Разделители (пробелы, скобки, дефисы, плюс) игнорируются.
function validatePhone() {
    const raw = phoneInput.value.trim();
    const errorId = 'error-phone';

    if (raw === '') {
        setError(phoneInput, errorId, 'Укажите контактный телефон');
        return false;
    }

    // Оставляем только цифры
    const digits = raw.replace(/\D/g, '');

    if (digits.length !== 11) {
        setError(phoneInput, errorId, 'Телефон должен содержать ровно 11 цифр');
        return false;
    }

    clearError(phoneInput, errorId);
    return true;
}

// Email: простая проверка формата
function validateEmail() {
    const value = emailInput.value.trim();
    const errorId = 'error-email';

    if (value === '') {
        setError(emailInput, errorId, 'Укажите адрес электронной почты');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        setError(emailInput, errorId, 'Некорректный адрес электронной почты');
        return false;
    }
    clearError(emailInput, errorId);
    return true;
}

// Секция: должно быть выбрано значение
function validateSection() {
    const value = sectionInput.value;
    const errorId = 'error-section';

    if (value === '') {
        setError(sectionInput, errorId, 'Выберите секцию конференции');
        return false;
    }
    clearError(sectionInput, errorId);
    return true;
}

// Тема доклада: обязательна, только если выбран «Есть доклад»
function validateTopic() {
    if (!reportYes.checked) {
        clearError(topicInput, 'error-topic');
        return true;
    }
    const value = topicInput.value.trim();
    const errorId = 'error-topic';

    if (value === '') {
        setError(topicInput, errorId, 'Укажите тему доклада');
        return false;
    }
    clearError(topicInput, errorId);
    return true;
}

// Дата рождения — необязательное поле, но если заполнено, проверим, что дата не в будущем
function validateBirthdate() {
    const errorId = 'error-birthdate';
    const value = birthdateInput.value;

    if (value === '') {
        clearError(birthdateInput, errorId);
        return true;
    }
    const date = new Date(value);
    if (date > new Date()) {
        setError(birthdateInput, errorId, 'Дата рождения не может быть в будущем');
        return false;
    }
    clearError(birthdateInput, errorId);
    return true;
}

// ---------- Обработчики событий ----------

// Валидация «на лету» при уходе из поля
fullnameInput.addEventListener('blur', validateFullname);
phoneInput.addEventListener('blur', validatePhone);
emailInput.addEventListener('blur', validateEmail);
sectionInput.addEventListener('change', validateSection);
topicInput.addEventListener('blur', validateTopic);
birthdateInput.addEventListener('blur', validateBirthdate);

// Очистка ошибки при вводе
fullnameInput.addEventListener('input', () => clearError(fullnameInput, 'error-fullname'));
phoneInput.addEventListener('input', () => clearError(phoneInput, 'error-phone'));
emailInput.addEventListener('input', () => clearError(emailInput, 'error-email'));
topicInput.addEventListener('input', () => clearError(topicInput, 'error-topic'));

// ---------- Отправка формы ----------

form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Валидируем все поля, чтобы показать все ошибки сразу
    const checks = [
        validateFullname(),
        validatePhone(),
        validateEmail(),
        validateSection(),
        validateBirthdate(),
        validateTopic()
    ];

    const allValid = checks.every(Boolean);

    if (!allValid) {
        result.textContent = 'Пожалуйста, исправьте ошибки в форме.';
        result.style.color = '#dc2626';
        return;
    }

    // Всё валидно — собираем данные (пока просто выводим в консоль)
    const data = {
        fullname: fullnameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        section: sectionInput.value,
        birthdate: birthdateInput.value || null,
        report: reportYes.checked ? 'yes' : 'no',
        topic: reportYes.checked ? topicInput.value.trim() : null
    };

    console.log('Данные формы:', data);

    result.textContent = 'Регистрация прошла успешно!';
    result.style.color = '#16a34a';
});