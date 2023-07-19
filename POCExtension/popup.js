document.getElementById('send').addEventListener('click', function() {
    var input = document.getElementById('input');
    var messages = document.getElementById('messages');
    
    if (input.value) {
      var message = document.createElement('div');
      message.textContent = input.value;
      messages.appendChild(message);
      input.value = '';
    }
  });
  