document.getElementById('submit').addEventListener('click', function () {
    var input = document.getElementById('inputBox');
    var messages = document.getElementById('messages');

    if (input.value) {
        var message = document.createElement('div');
        message.textContent = input.value;
        messages.appendChild(message);
        input.value = '';
    }
});