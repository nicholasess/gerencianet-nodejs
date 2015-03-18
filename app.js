var gerencianetnodejs = require('./gerencianet-nodejs');
var Api = new gerencianetnodejs("", '');

//Api.setCliente({});
Api.setPagamento('boleto', {
    vencimento: '10-10-10'
});

Api.Post(function(err, result){
    console.log(err);
});
    