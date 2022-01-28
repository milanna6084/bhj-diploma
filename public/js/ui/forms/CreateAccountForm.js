/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (response.success) {
        this.form.reset();
        App.update('user-logged');
        App.getModal('newAccount').close();
      } else {
        console.error(err);
      }
    })
  }
}

//// Выдает ошибку при создании счета с одинаковым наименованием у различных пользователей. //////