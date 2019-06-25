$('#btLogin').on('click', function(event) {
  event.preventDefault(); // To prevent following the link (optional)
  $.removeCookie('token', { path: '/', domain: document.location.hostname });
  $.ajax({
      type: "POST",
      url: '/api/auth',
      data: { 'login':$('#tbLogin').val(), 'password':$('#tbPassword').val() },
      success: function(data){
          //alert( "data" );
          //console.log(data);
          if(data.status = 'OK'){
              $.cookie("token", data.token, { path: '/', domain: document.location.hostname });
              if(window.location.search.startsWith('?rurl='))
              {
                    window.location.href = decodeURIComponent(window.location.search.substring(6))
              }else{
                    window.location.href = '/ui/index.html';
              }
          }
          else{
              alert( data.status + " : " + data.msg );
          }
      },
      dataType: 'json'
    })
    .fail(function(err) {
        var msg = "";
        
        if(err.responseJSON && err.responseJSON.status){
            msg = err.responseJSON.status + " : " + err.responseJSON.msg;
        }
        else{ 
            msg = err.status + " " + err.statusText;
        }
        
        alert(msg);
    });
});

$('#btRegistration').on('click', function(event) {
  event.preventDefault(); // To prevent following the link (optional)
  $('#modalRegistration').modal({show:true});
});

$('#btRegistrationModal').on('click', function(event) {
  event.preventDefault(); // To prevent following the link (optional)
  if($('#tbPasswordReg').val() != $('#tbPasswordRegRepeat').val()){
	  alert("Не одинаковые пароли");
	  return;
  }
  $.ajax({
      type: "PUT",
      url: '/api/auth',
      data: { 'login':$('#tbLoginReg').val(), 'password':$('#tbPasswordReg').val() },
      success: function(data){
          //alert( "data" );
          //console.log(data);
          if(data.status = 'OK'){
              $('#modalRegistration').modal('hide');
          }
          else{
              alert( data.status + " : " + data.msg );
          }
      },
      dataType: 'json'
    })
    .fail(function(err) {
        var msg = "";
        
        if(err.responseJSON && err.responseJSON.status){
            msg = err.responseJSON.status + " : " + err.responseJSON.msg;
        }
        else{ 
            msg = err.status + " " + err.statusText;
        }
        
        alert(msg);
    });
});