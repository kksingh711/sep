// var requst=require("request");
// requst("https://www.google.com",function(error,responce,body){
//     if(!error)
//     {
//         if(responce.statusCode==200)
//         {
//             console.log(body);
//         }
//         else{
//             console.log(responce.statusCode);
//         }
//     }
// });
const request = require('request');

const options = {
  method: 'GET',
  url: 'https://currency-exchange.p.rapidapi.com/exchange',
  qs: {to: 'INR', from: 'USD', q: '1'},
  headers: {
    'x-rapidapi-key': '61efbf1073mshb602e7788eae054p117c20jsn26276de185b1',
    'x-rapidapi-host': 'currency-exchange.p.rapidapi.com',
    useQueryString: true
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);
    var par=JSON.parse(body); 
	console.log(par);
});

//fca7abc7e5334b0fb7bd9f9ae7b347af