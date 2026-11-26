// ---------- Показ/скрытие поля темы доклада ----------

const reportYes  = document.getElementById('report-yes');
const reportNo   = document.getElementById('report-no');
const topicField = document.getElementById('topic-field');
const topicLabel = document.getElementById('topic-label');
const topicInput = document.getElementById('topic');

function toggleTopicField() {
    if (reportYes.checked) {
        topicField.hidden = false;
        topicLabel.hidden = false;
        topicInput.required = true;
    } else {
        topicField.hidden = true;
        topicLabel.hidden = true;
        topicInput.required = false;
        topicInput.value = '';
        clearError(topicInput, 'error-topic');
    }
}

reportYes.addEventListener('change', toggleTopicField);
reportNo.addEventListener('change', toggleTopicField);
toggleTopicField();

// ---------- Ссылки на элементы ----------

const form = document.getElementById('registration-form');
const formPage = document.getElementById('form-page');
const resultPage = document.getElementById('result-page');
const result = document.getElementById('result');
const backButton = document.getElementById('back-button');

const fullnameInput  = document.getElementById('fullname');
const phoneInput     = document.getElementById('phone');
const emailInput     = document.getElementById('email');
const sectionInput   = document.getElementById('section');
const birthdateInput = document.getElementById('birthdate');

// ---------- Вспомогательные ----------

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

function validatePhone() {
    const raw = phoneInput.value.trim();
    const errorId = 'error-phone';

    if (raw === '') {
        setError(phoneInput, errorId, 'Укажите контактный телефон');
        return false;
    }

    const digits = raw.replace(/\D/g, '');

    if (digits.length !== 11) {
        setError(phoneInput, errorId, 'Телефон должен содержать ровно 11 цифр');
        return false;
    }

    clearError(phoneInput, errorId);
    return true;
}

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

// ---------- Обработчики валидации ----------

fullnameInput.addEventListener('blur', validateFullname);
phoneInput.addEventListener('blur', validatePhone);
emailInput.addEventListener('blur', validateEmail);
sectionInput.addEventListener('change', validateSection);
topicInput.addEventListener('blur', validateTopic);
birthdateInput.addEventListener('blur', validateBirthdate);

fullnameInput.addEventListener('input', () => clearError(fullnameInput, 'error-fullname'));
phoneInput.addEventListener('input', () => clearError(phoneInput, 'error-phone'));
emailInput.addEventListener('input', () => clearError(emailInput, 'error-email'));
topicInput.addEventListener('input', () => clearError(topicInput, 'error-topic'));

// ---------- Вспомогательное: человекочитаемые значения ----------

const SECTION_NAMES = {
    math: 'Математика',
    physics: 'Физика',
    informatics: 'Информатика'
};

function formatDate(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (isNaN(date)) return isoString;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
}

// ---------- Заполнение страницы ответов ----------

function showResultPage(data) {
    document.getElementById('ans-fullname').textContent  = data.fullname;
    document.getElementById('ans-phone').textContent     = data.phone;
    document.getElementById('ans-email').textContent     = data.email;
    document.getElementById('ans-section').textContent   = SECTION_NAMES[data.section] || data.section;
    document.getElementById('ans-birthdate').textContent = formatDate(data.birthdate);
    document.getElementById('ans-report').textContent    = data.report === 'yes' ? 'Да' : 'Нет';

    const topicRow = document.getElementById('ans-topic-row');
    if (data.report === 'yes') {
        document.getElementById('ans-topic').textContent = data.topic;
        topicRow.hidden = false;
    } else {
        topicRow.hidden = true;
    }

    formPage.hidden = true;
    resultPage.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showFormPage() {
    resultPage.hidden = true;
    formPage.hidden = false;
    result.textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Отправка формы ----------

form.addEventListener('submit', (event) => {
    event.preventDefault();

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

    showResultPage(data);
});

// ---------- Кнопка «Заполнить заново» ----------

backButton.addEventListener('click', () => {
    form.reset();
    // После reset() нужно вручную вернуть состояние радиокнопок и сбросить классы валидации
    reportNo.checked = true;
    toggleTopicField();

    [fullnameInput, phoneInput, emailInput, sectionInput, birthdateInput, topicInput].forEach(input => {
        input.classList.remove('valid', 'invalid');
    });

    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    showFormPage();
});