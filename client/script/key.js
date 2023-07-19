var form = document.getElementById('form');
var apiInput = document.getElementById('apiInput');

var submitKey = (evt) =>{
    evt.preventDefault();
    console.log(apiInput.value);
    if(apiInput.value == ""){
        window.location.href = "acesskey.html";
    }else{
        window.location.href = "index.html";
    }
}
form.addEventListener('submit', submitKey)  