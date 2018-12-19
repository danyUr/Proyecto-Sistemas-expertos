var express  = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var mysql = require("mysql");
var app = express();

var credenciales = {
    user:"root",
    password:"",
    port:"3306",
    host:"localhost",
    database:"db_gearcode"
};

app.use(express.static("public")); 
app.use(express.static("home")); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use(session({secret:"ASDFE$%#%",resave:true, saveUninitialized:true}));


app.get("/guardar",function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(/*"INSERT INTO usuarios(nombre, apellido, edad, password, pais) VALUES (?,?,?,?,?)"*/
    "INSERT INTO tbl_usuarios(contrasena, usuario, correo) VALUES (?,?,?)",
        [req.query.contrasena, req.query.usuario, req.query.correo],
        function(error, data, fields){
            res.send(data);
            res.end();
        }
    );
});



app.use(
    function(req,res,next){
        if (req.session.correoUsuario){
            if (req.session.codigoTipoUsuario == 1)
                publicCajero(req,res,next);
            else if (req.session.codigoTipoUsuario == 2)
                publicAdmin(req,res,next);
        }
        else
            return next();
    }
);

///Para agregar seguridad a una ruta especifica:
function verificarAutenticacion(req, res, next){
	if(req.session.correoUsuario)
		return next();
	else
		res.send("ERROR, ACCESO NO AUTORIZADO");
}

app.post("/login",function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        /*"SELECT codigo_usuario, nombre_usuario, correo FROM tbl_usuarios WHERE contrasena = ? and correo=?"*/
        "SELECT idusuarios, correo FROM tbl_usuarios WHERE contrasena = ? and correo=?",
        [req.body.contrasena, req.body.usuario],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                if (data.length==1){
                    req.session.codigoUsuario = data[0].codigo_usuario;
                    req.session.correoUsuario = data[0].correo;
                    //req.session.codigoTipoUsuario = data[0].codigo_tipo_usuario
                }
                res.send(data);
                res.end();
            }
        }
    )
});

app.get("/obtener-session",function(req,res){
    res.send("Codigo Usuario: " + req.session.codigoUsuario+
            ", Correo: " + req.session.correoUsuario
    );
    res.end();
});

app.get("/cerrar-sesion",function(req,res){
    req.session.destroy();
    res.send("Sesion eliminada");
    res.end();
});

app.get("/contenido-registringido",verificarAutenticacion,function(req, res){
    res.send("Este es un contenido restringido");
    res.end();
});



app.listen(8081);