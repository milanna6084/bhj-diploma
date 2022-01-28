/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

//const { response } = require("express");

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Пустой элемент!');
    }

    this.element = element;
    this.update();
    this.registerEvents();

  }


  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      const item = event.target; 
      const closestLi = item.closest('li');

      if (item.classList.contains('create-account')) {
        App.getModal('newAccount').open();
      }
      if (closestLi.classList.contains('account')) {
        this.onSelectAccount(closestLi);
      }
      
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();

    if (!currentUser) {
      return;
    }

    const { email } = currentUser;
   // console.log('Update Account widget')

    Account.list({ email }, (err, response) => {
      if (response.success) {
        this.clear();
        this.renderItem(response);
      } else {
        console.error(err);
      }
    });
  }


  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('.account').forEach(item => {
      item.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    this.element.querySelectorAll('.account').forEach(item => {
      item.classList.remove('active')
    });

    element.classList.add('active');

    App.showPage('transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const { name, id, sum } = item;
    const li = `
      <li class = account data-id=${id}>
        <a href="#">
            <span>${name}</span> /
            <span>${sum} ₽</span>
        </a>
      </li>
    `;
    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    for (let item of data.data) {
      this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));        
    }
  }
}
