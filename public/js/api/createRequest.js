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

    if (this.status === 200) {
      response = this.response;
       
      if (this.response.success) {
         err = null;
      } else {
        err = this.response.error;
      } 
      callback(err, response);     
    }
  }

  if (method === 'GET') {
    xhr.open(method, `${url}?email=${data.email}&password=${data.password}&name=${data.name}}&id=${data.id}&user_id=${data.user_id}&account_id=${data.account_id}`);
    xhr.send();
  } else {
    const formData = new FormData();

    formData.append('user_id', data.user_id);
    formData.append('account_id', data.account_id);
    formData.append('sum', data.sum);
    formData.append('type', data.type);
    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

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
