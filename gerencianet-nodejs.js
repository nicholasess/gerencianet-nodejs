var request = require('request');
var js2xmlparser = require('js2xmlparser');
var xml2js = require('xml2js').parseString;
var lodash = require('lodash');
var util = require('util');

var gerenciaWS = function(token, tipo){
	this.token = setToken(token);
	
	this.url = setUrl(tipo);
	
	this.array = {
        itens: [],
        descricao: "",
        retorno:{
        	identificador: "",
        	urlNotificacao: ""
        },
        desconto: 0,
        frete: "",
        tipo: "",
        ocorrencias: "",
        periodicidade: "",
        cliente: {
        	nome: "",
        	cpf: 0,
        	email: "",
        	nascimento: "",
        	celular: 0,
        },
        enderecoEntrega:{
        	logradouro: "",
        	numero: 0,
        	bairro: "",
        	cidade: "",
        	cep: 0,
        	estado: "",
        	complemento: ""
        },
        enderecoCobranca: {
        	logradouro: "",
        	numero: 0,
        	bairro: "",
        	cidade: "",
        	cep: 0,
        	estado: "",
        	complemento: ""	
        },
        formaPagamento:{}
	};
} 


gerenciaWS.prototype.setCliente = function(cliente) {
	if(verifyError(cliente)){
		throw new TypeError('O cliente não foi informado');	
	}else{
		if(isObject(cliente)){
			this.array.cliente = {
				nome: cliente['nome'] || "",
				cpf: cliente['cpf'] || "",
				email: cliente['email'] || "",
				nascimento: cliente['nascimento'] || "",
				celular: cliente['celular'] || ""
			}	
		}
	}	
};

gerenciaWS.prototype.setPagamento = function(tipo, object){
	if(isObject(object)){
		switch(tipo){
			case 'boleto':{
				this.formaPagamento = {
					boleto: object['vencimento'] || ""
				}
			};
			break;
			case 'cartao': {
				this.formaPagamento = {
					cartao: {
						parcelas: object['parcelas'] || 1,
						enderecoCobranca: this.enderecoCobranca
					}
				}
			};
			break;
			default: {
				throw new TypeError('boleto ou cartao, outro tipo não é aceitavel');	
			};
			break;
		}
	}
}

gerenciaWS.prototype.Post = function(callback){
	this.retornXML = setXML(this.array);
	var form = { token: this.token, dados: this.retornXML };
	request.post(this.url, { form:  form}, function (err, response, body) {
        xml2js(body, function(err2, result){
        	if(err2){
        		throw new TypeError('Erro ao converter XML para JSON');
        	}else{
        		var erros = result.integracao.erros;
        		var integracao = result.integracao;
        		callback(erros, integracao);
        	}
        	
        });
	});
}

gerenciaWS.prototype.setAll = function(object){
	if(verifyError(object)){
		throw new TypeError('Parametro não é OBJECT');	
		return false;
	}

	this.array = lodash.extend(this.array, object);
}

function setXML(array){
	return js2xmlparser("integracao",array);
}

function setUrl(tipo){
	switch(tipo){
		case 'env': {
			return "https://go.gerencianet.com.br/teste/api/checkout/assinatura/pagar/xml";
		};
		break;
		case 'prod': {
			return "https://go.gerencianet.com.br/api/checkout/assinatura/pagar/xml";
		};
		break;
		default: {
			throw new TypeError('Env ou Prod, outro tipo não é aceitavel');	
		};
		break;
	}
}

function setToken(token){
	if(verifyError(token)){
		throw new TypeError('Token não foi informado');	
	}

	return token;
}

function verifyError(param){
	if((param == null) || (typeof param == undefined) || (param == "")){
	   return true;
	}else{
	   return false;	
	}	
}

function isObject(param){
	if(util.isArray(param) || typeof param !== 'object'){
		throw new TypeError('Parametro não é OBJECT');	
		return false;
	}
	else{
		return true;
	}
}

module.exports = gerenciaWS;

