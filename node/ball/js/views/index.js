var selectedData = [];
var enabledBtChange = false;
var enabledBtDelete = false;
var enabledAddDocs = false;
var visbleOnlyOwnerDocs = false;

function updateResult()
{
    $('#findResultTable').bootstrapTable('refresh');
    return;
    
}

$(document).ready(function() {
    enabledButton();
	enabledButtonAdd();
    
    $('#lnExit').on('click', function(event) {
      event.preventDefault();
      $.removeCookie('token', { path: '/', domain: document.location.hostname });
    });
    
    /*$('#btFindRecord').on('click', function(event) {
      event.preventDefault();
        updateResult();
    });*/
    
    $('#cbOnlyMyDocs')
        .on('change', function(){
            updateResult();
        });
    
    $('#findResultTable').bootstrapTable({
        url: '/api/find',
        method: 'GET',
        queryParams: function (p) {
            return { 'Onlyowner': $('#cbOnlyMyDocs').is(':checked') ? 1 : 0
			}
        },
        rowStyle: rowStyle,
        columns: [
                     {
                         field: 'ID',
                         title: 'Ид',
                         sortable: false,
                         width: '35%'
                     },
                     {
                         field: 'Name',
                         title: 'Название',
                         sortable: true
                     },
                     {
                         field: 'Date',
                         title: 'Дата создания',
                         sortable: true
                     },
                     {
                         field: 'Number',
                         title: 'Номер',
                         sortable: true
                     },
                     {
                         field: 'Description',
                         title: 'Примечание',
                         sortable: false
                     },
                     {
                         field: 'Owner',
                         title: 'Ид создателя',
                         sortable: true
                     },
					 {
						 field: 'call',
						 title: 'Функции',
						 sortable: false,
						 formatter: buton_formater,
					     width: '10%'
					 }
                ],
        ajax: function(params){
            //console.log(params.data);
            $.ajax({
              type: "GET",
              url: '/api/find',
              data: { 'Onlyowner': $('#cbOnlyMyDocs').is(':checked') ? 1 : 0
		      },
              cache: false,
              success: function(data){
                  if(data.status = 'OK'){
                      //console.log(data);
                      $('#findResultTable').bootstrapTable('load', data.data);
                      $('#lbResultCount').text('Выбрано ' + data.data.length + ' из ' + data.count + ' записей');
                      params.complete();
                  }
                  else{
                      params.complete();
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
                
                params.complete();
                alert(msg);
            });
        }
    });   
});

function lnExit_click()
{
    $.removeCookie('token', { path: '/', domain: document.location.hostname });
    window.location.href = '/ui/login.html';
}

var currentRecord = NaN;
var RecordIsPlayed = false;

function rowStyle(value, row, index){
    if(value.status == 2){
        return {
            css: {"background-color" : "gray"}
        };
    }
    else
    {
        return {
            //css: {"background-color" : "gray"}
        };
    }
}

//Делает видимой кнопки удаления и изменения
function enabledButton(){
	$.ajax({
		url: '/api/role/changeDocs',
		method: 'GET',
		cache: false,
		dataType: 'json',
		success: function(data){
			enabledBtChange = data.allowed;
			enabledBtDelete = data.allowed;
		}
	});
//не работает на форму раньше выходит 
	/*$.ajax({
		url: '/api/role/deleteDocs',
		method: 'GET',
		cache: false,
		dataType: 'json',
		success: function(data){
			enabledBtDelete = data.allowed;
			console.log('enabledBtDelete ' + enabledBtDelete);
		}
	});*/
}
//Делает видимой кнопки удаления и изменения
function enabledButtonAdd(){
	$.ajax({
		url: '/api/role/addDocs',
		method: 'GET',
		cache: false,
		dataType: 'json',
		success: function(data){
			enabledAddDocs = data.allowed;
			console.log('enabledAddDocs ' + enabledAddDocs);
			if(!enabledAddDocs){
				$('#btAdd').hide();
				$('#divCbOnlyMyDocs').hide();
				$("#spanExit").attr('class', 'glyphicon glyphicon-log-in');
			}
		}
	});
}

function onAdd(){
	$('#modalAddDocs').modal({show:true});
}

function onEdit(index){
	 var rowData = $('#findResultTable').bootstrapTable('getData')[index];
	 $("#tbNameEdit").val(rowData.Name);
	 $("#tbNumberEdit").val(rowData.Number);
	 $("#tbDescriptionEdit").val(rowData.Description);
	 $("#tbDateEdit").val(rowData.Date);
	 $("#tbIdEdit").val(rowData.ID);
	 
	 $('#modalEditDocs').modal({show:true});
}

function AddDoc(){
	$.ajax({
		type: "PUT",
		url: '/api/find',
		data: { 
			'Number': $('#tbNumberAdd').val(),
			'Name': $('#tbNameAdd').val(),
			'Description': $('#tbDescriptionAdd').val(),
			'Date': $('#tbDateAdd').val(),
	  },
	  cache: false,
	  success: function(data){
		  if(data.status = 'OK'){
			  updateResult();
			  $('#modalAddDocs').modal({show:false});
		  }
		  else{
			  params.complete();
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
		
		params.complete();
		alert(msg);
	});
}

function EditDoc(){
	$.ajax({
		type: "POST",
		url: '/api/find',
		data: { 
			'Number': $('#tbNumberEdit').val(),
			'Name': $('#tbNameAdd').val(),
			'Description': $('#tbDescriptionEdit').val(),
			'Date': $('#tbDateEdit').val(),
			'ID':$('#tbIdEdit').val()
	  },
	  cache: false,
	  success: function(data){
		  if(data.status = 'OK'){
			  updateResult();
			  $('#modalEditDocs').modal({show:false});
		  }
		  else{
			  params.complete();
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
		
		params.complete();
		alert(msg);
	});
}

function onDelete(index){
	var rowData = $('#findResultTable').bootstrapTable('getData')[index];
	$.ajax({
		type: "DELETE",
		url: '/api/find',
		data: { 
			'ID':rowData.ID
	  },
	  cache: false,
	  success: function(data){
		  if(data.status = 'OK'){
			  updateResult();
		  }
		  else{
			  params.complete();
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
		
		params.complete();
		alert(msg);
	});
}


//Формирование  кнопок функции в таблице
function buton_formater(value, row, index){
	var styleChange = !enabledBtChange? 'style="display: none"': '';
	console.log(!enabledBtDelete);
	var styleDelete = !enabledBtDelete? 'style="display: none"': '';
	var str = '<a title="Редактировать"   class="btn btn-default glyphicon glyphicon-edit" onClick="onEdit(' + index + ')" ' + styleChange + '> </a>'
		+'<a title="Удалить"   class="btn btn-default glyphicon glyphicon-remove" onClick="onDelete(' + index + ')" ' + styleDelete + '> </a>';
    return str;
}