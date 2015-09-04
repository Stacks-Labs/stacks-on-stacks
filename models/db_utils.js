var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : '127.0.0.1',
        user     : 'amigo',
        password : 'letstravel',
        database : 'amigo',
        charset  : 'utf8'
  }
});

// module.exports{
//   functionName: function(){
//     return 'hello world'
//   }

// }