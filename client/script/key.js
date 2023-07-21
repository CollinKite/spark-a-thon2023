var form = document.getElementById('form');
var apiInput = document.getElementById('apiInput');

var submitKey = (evt) =>{
    evt.preventDefault();
    console.log(apiInput.value);
    if(apiInput.value == ""){
        window.location.href = "acesskey.html";
        console.log(apiInput.value);
        console.log("form is null");
    }else{
        window.location.href = "index.html";
        console.log(apiInput.value);
        console.log("form is not null");
    }
}
form.addEventListener('submit', submitKey)  