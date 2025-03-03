const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '85.31.233.39',
  user: 'admin',
  password: 'Admin123#',
  database: 'u933411614_gamestore',
  port: 3306
});

connection.connect(function(err) {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('¡Conexión exitosa!');
  
  // Probar una consulta simple
  connection.query('SELECT USER(), CURRENT_USER()', function (error, results) {
    if (error) {
      console.error('Error en consulta:', error);
    } else {
      console.log('Resultados:', results);
    }
    connection.end();
  });
});
