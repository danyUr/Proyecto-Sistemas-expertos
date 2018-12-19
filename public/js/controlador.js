$("#btn-login").click(function(){
    console.log($("#form-login").serialize());
    $.ajax({
        url:"/login",
        method:"POST",
        data:$("#form-login").serialize(),
        dataType:"json",
        success:function(respuesta){
            console.log(respuesta);
            if (respuesta.length == 1)
                window.location.href = "/Dashboard.html";
            else 
                alert("Credenciales invalidas");
        },
        error:function(error){
            console.error(error);
        }
    });
});

$("#btn-registrar").click(function(){
    console.log($("#form-registrar").serialize());
	/*var parametros = `nombre=${$("#usuario").val()}&email=${$("#email").val()}&contrasena=${$("#contrasena").val()}&urlimagen=${$("#imagen").val()}`;
	console.log(parametros);*/
	$.ajax({
		url:"/guardar",
		method:"GET",
		data: $("#form-registrar").serialize(),
		dataType:"json", //json
		success: function(respuesta){ //200 OK
			console.log(respuesta);
		},
		error:function(error){
			console.error(error);
		}
	});
});


function modalRegistro(){
	$("#modalRegistro").modal("show");
}