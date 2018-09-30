var head = document.getElementsByClassName("msg_head");
var body = document.getElementsByClassName("msg_wraper");
var text = document.getElementById("msg_input");
var chat = document.getElementById("msg_body");
var csrftoken = getCookie('csrftoken');


for (i = 0; i < head.length; i++) {
    head[i].addEventListener("click", function() {
    console.log($('#msg_body').is(':empty'));
    if($('#msg_body').is(':empty'))
        $("#message").submit();
    this.classList.toggle("active");
            if (body[0].style.display == "block") {
                body[0].style.display = "none";
            } else {
                body[0].style.display = "block";
            }
        }
    )
};

var socialFloat = document.querySelector('.msg_box');
var footer = document.querySelector('footer');

function checkOffset() {
    function getRectTop(el){
        var rect = el.getBoundingClientRect();
        return rect.top;
    }

    if((getRectTop(socialFloat) + document.body.scrollTop) + socialFloat.offsetHeight >= (getRectTop(footer) + document.body.scrollTop) - 10){
        socialFloat.style.bottom = window.innerHeight - getRectTop(footer) + 'px';
    }
    if(document.body.scrollTop + window.innerHeight < (getRectTop(footer) + document.body.scrollTop)){
        socialFloat.style.bottom = 0; // restore when you scroll up
    }
}

document.addEventListener("scroll", function(){
    checkOffset();
});

text.addEventListener("keypress" ,function(e) {
    if(e.which == 13 && !e.shiftKey && text.value!=''){
        chat.innerHTML += "<div class='msg_user'>" + text.value + "</div><br/>";
        chat.scrollTop = chat.scrollHeight;
        $("#message").submit();
        text.value = "";
        e.preventDefault();
        return false;
    }
})

//Getting csrf token
function getCookie(name){
    var cookieValue = null;
    if(document.cookie && document.cookie!==''){
        var cookies = document.cookie.split(';');
        for(var i=0; i<cookies.length; i++){
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(function(){
    $('#message').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: {
                'message': $('#msg_input').val(),
                'csrfmiddlewaretoken': csrftoken
            },
            dataType: 'json',
            method: $(this).attr('method'),
            success: function(data){
                chat.innerHTML += "<div class='msg_bot'>" + data.response + "</div><br/>";
                chat.scrollTop = chat.scrollHeight;
            }
        });
    });
});