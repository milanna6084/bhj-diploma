//const { options } = require("nodemon/lib/config");

/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  static lastOptions = {};

  constructor(element) {
    if (!element) {
      throw new Error('Пустой элемент!');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(TransactionsPage.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
   // console.log('registerEvents');
      const removeButton = this.element.querySelector('.remove-account'); 
      const accountName = this.element.querySelector('.content-title');
      const content = this.element.querySelector('.content')

      removeButton.addEventListener('click', () => {
        if (accountName.textContent !=="Название счёта") {
          this.removeAccount();
        }
      });

      content.addEventListener('click', (event) => {
        const item = event.target;
        if (
          item.classList.contains('transaction__remove')
          || item.closest('button').classList.contains('transaction__remove')
        ) {
          let id = item.dataset.id;
          this.removeTransaction(id);
        }
      }); 
    } 

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    const result = confirm('Вы действительно хотите удалить этот счёт?');

    if (!result) {
      return;
    }

    Account.remove({ id: TransactionsPage.lastOptions.account_id }, (err, response) => {
      if (response.success) {
        this.clear();
        App.updateWidgets();
        App.updateForms();
      } else {
        console.error(err);
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const result = confirm('Вы действительно хотите удалить эту транзакцию?');

    if (!result) {
      return;
    }

    Transaction.remove({ id: id }, (err, response) => {
      if (response.success) {
        App.update();
      } else {
        console.error(err);
      }
    });

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) { 
    TransactionsPage.lastOptions = options;

    if (options.account_id) {
      Account.get(options.account_id, (err, response) => {
        if (!response.success) {
          console.error(err);
          return;
        }

        this.renderTitle(response.data.name);

        Transaction.list({ account_id: options.account_id }, (err, response) => {
          if (response.success) {
            this.renderTransactions(response.data);
          } else {
            console.error(err);
          }
        });
      });
    }

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.element.querySelector('.content-title').innerText = 'Название счёта';
    TransactionsPage.lastOptions = {};
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const newDate = new Date(date);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    return newDate.toLocaleString('ru', options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const { created_at,
      id,
      name,
      sum,
      type,
    } = item;
    const account = `
      <div class="transaction transaction_${type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${name}</h4>
              <div class="transaction__date">${this.formatDate(created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id=${id}>
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>
    `;

    return account;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    //console.log('render Transaction page');
    const content = this.element.querySelector('.content');

    content.innerHTML = '';

    for (let item of Array.from(data)) {
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    }
  }
}