================
Удаление списков
================


Подготовка
==========

Перед началом этого урока, Вам понадобится cледующее:

  * `alexyoung/dailyjs-backbone-tutorial <https://github.com/alexyoung/dailyjs-backbone-tutorial>`_
    коммит ``0953c5d``
  * API key из :ref:`части 2 <google-api-key-setup>`
  * Client ID из :ref:`части 2 <google-client-id-setup>`
  * обновить ``app/js/config.js`` полученными значениями (если Вы зачекаутили мой репо)

Чтобы получить исходный код, выполните следующую команду (или используйте
подходящую Git UI утилиту):

.. code-block:: bash

    $ git clone git@github.com:alexyoung/dailyjs-backbone-tutorial.git
    $ cd dailyjs-backbone-tutorial
    $ git reset --hard 0953c5d


Удаление списков
================

Мы уже в конце пути реализации CRUD для списков задач. Чтобы добавить
возможность удаления списка, необходимо лишь добавить обработчик перехода
по ссылке, которую мы добавили ранее, а так же добавить поддержку метода
``delete`` в ``gapi.js``. Вы можете немного попрактиковаться и попробовать
реализовать это самостоятельно.

Откройте ``app/js/views/app.js`` и добавьте обработчик события для ссылки
«Delete List»:

.. code-block:: javascript

    events: {
          'click #add-list-button': 'addList'
        , 'click #edit-list-button': 'editList'
        , 'click #delete-list-button': 'deleteList'
    },

Далее, в тот же класс добавьте метод ``deleteList``:

.. code-block:: javascript

    deleteList: function() {
      if (confirm('Are you sure you want to delete that list?')) {
        bTask.views.activeListMenuItem.model.destroy();
      }
      return false;
    }

С помощью этих двух небольших изменений, выбранный список будет удален из
интерфейса. Backbone знает, как удалять представление, когда вызывается
``model.destroy`` в методе ``deleteList``.


Изменения в Backbone.sync
=========================

Чтобы выполнить удаление списка и на сервере, откройте ``app/js/gapi.js``
и добавьте ещё один ``case`` для метода ``delete`` (сразу после ``update``):

.. code-block:: javascript

    case 'delete':
      requestContent['resource'] = model.toJSON();
      request = gapi.client.tasks[model.url].delete(requestContent);
      Backbone.gapiRequest(request, method, model, options);
    break;

Google API предоставляет метод ``delete``. В остальном, это копия метода
``update``.


Что дальше
==========

Эта часть короткая. Так что можете поиграть с исходниками и посмотреть, что
могут делать вместе Google Tasks API и Backbone! Однако, не смотря на это,
ещё много чего надо рассказать.

За прошедние 8 постов Вы должны были научиться:

  * писать свою реализацию метода ``Backbone.sync``
  * использовать `Google Task API <https://developers.google.com/google-apps/tasks/>`_ 
    вместе с клиентским JavaScript
  * реализовывать Backbone модели, коллекции и представления

Рассмотренные примеры могут быть адаптированы для работы с другими Google API
или даже с API, которые мы не рассматривали. Как только Вы разберётесь в том,
как работают Backbone модели и синхронизация данных, для Вас многое станет
возможным!


Следующие несколько уроков будут освещать такие темы, как:

  * использование mock-объектов для тестирования Google Tasks API
  * создание, редактирование и удаление самих задач
  * Bootstrap
  * кастомизация Bootstrap

Итоги
=====

Все изменения — `одной пачкой <https://github.com/alexyoung/dailyjs-backbone-tutorial/tree/8d88095de512c084ccf4cb28e49844df05396e0f>`_.
