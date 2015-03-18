var gerencianetnodejs = require('./gerencianet-nodejs');
var Api = new gerencianetnodejs("BBCC49FBFB2174A40D73BA76E7FAD272A0D0A821", 'env');

//Api.setCliente({});
Api.setPagamento('boleto', {
    vencimento: '10-10-10'
});

Api.Post(function(err, result){
    console.log(err);
});
    