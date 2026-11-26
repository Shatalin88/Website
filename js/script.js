const reportYes = document.getElementById('report-yes');
const reportNo  = document.getElementById('report-no');
const topicField = document.getElementById('topic-field');
const topicInput = document.getElementById('topic');

function toggleTopicField() {
    if (reportYes.checked) {
        topicField.hidden = false;
        topicInput.required = true;   // тема обязательна, если есть доклад
    } else {
        topicField.hidden = true;
        topicInput.required = false;
        topicInput.value = '';        // очищаем, чтобы не ушло «мусорное» значение
    }
}

reportYes.addEventListener('change', toggleTopicField);
reportNo.addEventListener('change', toggleTopicField);

// Инициализация при загрузке страницы (на случай, если браузер восстановит выбор)
toggleTopicField();