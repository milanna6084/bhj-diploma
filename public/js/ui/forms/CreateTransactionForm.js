//const { append } = require("express/lib/response");
//--------Закомментировала эту строку в 5ти файлах, иначе выходит ошибка "Require is not defined" ------------//

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    console.log('render Acconts list in select')
    const list = this.form.querySelector('.accounts-select');

    if (!User.current()) {
      return;
    }

    const { email } = User.current();

    Account.list({ email }, (err, response) => {
      if (!response.success) {
        console.error(err);
        return;
      }

      list.innerHTML = '';

      for (let item of response.data) {
        const option = document.createElement('option');

        option.value = item.id;
        option.innerText = item.name;

        list.append(option);
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (!response.success) {
        console.error(err)
      }

      App.update();
      this.form.reset();

      App.getModal('newIncome').close();
      App.getModal('newExpense').close();
    });
  }
}