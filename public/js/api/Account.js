/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  static get(id, callback){
    createRequest({
      url: Account.URL + '/' + id,
      data: {},
      method:'GET',
      callback: callback
    });   
  }
}
