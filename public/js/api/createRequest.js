/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const { url, data, method, callback } = options;
  const xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  xhr.addEventListener('load', getResponse);
  xhr.addEventListener('error', () => {
    console.error("Запрос не выполнен");
  });

  function getResponse() {
    let response;
    let err;
    
    response = this.response;
    (this.response.success) ? err = null : err = this.response.error;
         
    callback(err, response);     
  
  }

  const formData = new FormData();
  let urlForGet = '';

  for (let value in data) {
    urlForGet = `${urlForGet}${value}=${data[value]}&`
    formData.append(value, data[value]);
  }
  if (method === 'GET') {
    xhr.open(method, `${url}?${urlForGet}`);
    xhr.send();
  } else {
    xhr.open(method, url);
    xhr.send(formData);
  }
};
// здесь перечислены все возможные параметры для функции
/*createRequest({
    url: 'https://example.com', // адрес
    data: { // произвольные данные, могут отсутствовать
      email: 'ivan@poselok.ru',
      password: 'odinodin'
    },
    method: 'GET', // метод запроса
    /*
      Функция, которая сработает после запроса.
      Если в процессе запроса произойдёт ошибка, её объект
      должен быть в параметре err.
      Если в запросе есть данные, они должны быть переданы в response.
    
    callback: (err, response) => {
      console.log( 'Ошибка, если есть', err );
      console.log( 'Данные, если нет ошибки', response );
    }
  });*/
