======================
Редактирование списков
======================


Подготовка
==========

Перед началом этого урока, Вам понадобится cледующее:

  * `alexyoung/dailyjs-backbone-tutorial <https://github.com/alexyoung/dailyjs-backbone-tutorial>`_
    коммит ``465523f``
  * API key из :ref:`части 2 <google-api-key-setup>`
  * Client ID из :ref:`части 2 <google-client-id-setup>`
  * обновить ``app/js/config.js`` полученными значениями (если Вы зачекаутили мой репо)

Чтобы получить исходный код, выполните следующую команду (или используйте
подходящую Git UI утилиту):

.. code-block:: bash

    $ git clone git@github.com:alexyoung/dailyjs-backbone-tutorial.git
    $ cd dailyjs-backbone-tutorial
    $ git reset --hard 465523f


Активный список
===============

В прошлом уроке я показал, как сделать свой обработчик метода ``create``
в ``Backbone.sync``. А так же были реализованы все необходимые
представления и шаблоны для добавления новых списков. Если Вы помните, я
так же сделал представление для редактирования списка. Так как оно очень
похоже на ``AddListView``, то я просто унаследовался от него.

Перед тем, как позволить редактировать списки, необходимо добавить возможность
выбирать список, с которым будет выполняться то или иное действие. В данном
приложении имеет смысл всегда иметь активный список, так что нам нужен способ
хранения состояния. Кроме того, после загрузки списков с сервера, необходимо
выбирать дефолтный список в качестве активного (как будто сам пользователь
сделал его активным).

Чтобы не нарушать подход, который мы использовали для хранения экземпляров
представлений и коллекций, необходимо таким же образом добавить и объект
``models`` для хранения экземпляров моделей. При этом, любой экземпляр модели
может быть ``activeList``.

Откройте ``app/js/app.js`` и добавьте новое свойство ``models``, а так же
код для установки значения для ``activeModel`` после того, как загрузятся
модели с сервера:

.. code-block:: javascript

    App.prototype = {
      views: {},
      collections: {},
      models: {},

      connectGapi: function() {
        var self = this;
        this.apiManager = new ApiManager(this);
        this.apiManager.on('ready', function() {
          self.collections.lists.fetch({
              data: { userId: '@me' },
              success: function(res) {
                self.models.activeList = self.collections.lists.first();
                self.views.listMenu.render();
              }
          });
        });
      }
    };

Теперь откройте ``app/js/views/lists/menu.js`` и добавьте проверку: является
ли текущий отрисовываемый объект ``activeModel``:

.. code-block:: javascript

    renderMenuItem: function(model) {
      var item = new ListMenuItemView({ model: model });
      this.$el.append(item.render().el);

      if (model.get('id') === bTask.models.activeList.get('id')) {
        item.open();
      }
    },

Если является, то необходимо вызвать метод ``open`` в представлении. Теперь
откройте ``app/js/views/lists/menuitem.js`` и научите ``ListMenuItemView``
отслеживать ``activeModel``:

.. code-block:: javascript

    open: function() {
      bTask.models.activeList = this.model;
      return false;
    }

Теперь приложение способно различать выбранный пользователем активный список.
Это облегчит добавление новых задач, так как перед тем, как добавить задачу,
нам необходимо знать, в какой список её добавлять.


Форма редактирования списка
===========================

Откройте ``app/js/views/app.js``. Цель данного примера: при нажатии кнопки
«Редактировать» показывать форму с заполненными полями. Это будет похоже
на рассмотренный на прошлой неделе метод ``addList``, так что Вы можете
попробовать сделать это сами, если захотите.

Для начала, добавим в загрузку класс ``EditListView``:

.. code-block:: javascript

    define([
      'text!templates/app.html'
    , 'views/lists/add'
    , 'views/lists/edit'
    ],

    function(template, AddListView, EditListView) {

Далее, добавим ``#edit-list-button`` в события:

.. code-block:: javascript

    events: {
      'click #add-list-button': 'addList'
    , 'click #edit-list-button': 'editList'
    },

И наконец, добавим метод ``editList``, в котором будем создавать экземпляр
формы ``EditListView``, передавая в неё модель ``activeList``:

.. code-block:: javascript

    editList: function() {
      var form = new EditListView({ model: bTask.models.activeList });

      this.$el.find('#list-editor').html(form.render().el);
      form.$el.find('input:first').focus();

      return false;
    }

Это очень :ref:`похоже <add-list-button>` на реализацию метода ``addList``.
То есть, они могут использовать один и тот же метод с разными моделями:

.. code-block:: javascript

    listForm: function(form) {
      this.$el.find('#list-editor').html(form.render().el);
      form.$el.find('input:first').focus();

      return false;
    },

    addList: function() {
      return this.listForm(
        new AddListView({
            model: new bTask.collections.lists.model({ title: '' })
        })
      );
    },

    editList: function() {
      return this.listForm(
        new EditListView({
            model: bTask.models.activeList
        })
      );
    }

`DRY <http://ru.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself>`_!


Сохранение изменений
====================

Необходимо доработать метод ``Backbone.sync``, чтобы он умел обрабатывать
изменение моделей. Это очень похоже на логику обработки создания модели
(``app/js/gapi.js``):

.. code-block:: javascript

    // В районе строки 97, после 'create'
    case 'update':
      requestContent['resource'] = model.toJSON();
      request = gapi.client.tasks[model.url].update(requestContent);
      Backbone.gapiRequest(request, method, model, options);
    break;

Небольшая сложность тут заключается в том, что Google API требует, чтобы
в объекте, передаваемом в метод ``update``, было свойство ``tasklist``.
Это не очень хорошо задокументировано (обратите внимание, что
`tasklist/update <https://developers.google.com/google-apps/tasks/v1/reference/tasklists/update>`_
руководство не содержит JavaScript примеров).

Самым подходящим местом, где можно обойти эту ситуацию, кажется, будет
метод ``Backbone.sync``. То есть, всё необходимое будет в одном месте.

Добавьте оператор ``switch``, чтобы добавлять требуемый параметр ``id``
в зависимости от того, с какой моделью идёт работа:

.. code-block:: javascript

    Backbone.sync = function(method, model, options) {
      var requestContent = {};
      options || (options = {});

      switch (model.url) {
        case 'tasks':
          requestContent.task = model.get('id');
        break;

        case 'tasklists':
          requestContent.tasklist = model.get('id');
        break;
      }

Теперь списки можно редактировать. Осталось сделать ещё одну вещь: показывать,
что выбранный список «активен».


Выбор списков
=============

Откройте ``app/js/views/lists/menuitem.js`` и скорректируйте метод ``open``,
чтобы отслеживалось представление активного меню и, при необходимости,
добавлялся css-класс в элемент представления:

.. code-block:: javascript

    open: function() {
      if (bTask.views.activeListMenuItem) {
        bTask.views.activeListMenuItem.$el.removeClass('active');
      }

      bTask.models.activeList = this.model;
      bTask.views.activeListMenuItem = this;
      this.$el.addClass('active');

      return false;
    }

``bTask.views.activeListMenuItem`` будет использовано для хранения ссылки на
представление при его открытии. Обратили внимание, что я использовал
``this.$el``? Опытные Backbone разработчики скажут Вам, что для поиска
элементов по селектору, необходимо делать именно так, а не использовать ``$()``
из jQuery. Основная идея: минимально обращаться напрямую к jQuery и стремиться
к более декларативному Backbone-коду.

При внимательном рассмотрении вышеуказанного кода, может возникнуть вопрос: а
надо ли нам отслеживать активный список, сохраня указатель на модель?
Представление ``ListMenuItemView`` уже содержит эту модель и большая часть
Backbone-кода сосредоточена на пользовательском интерфейсе, а не на
дополнительном внутреннем состоянии. Давайте попробуем убрать ссылку на
``bTask.models``.

Откройте ``app/js/app.js`` и удалите объект ``models``, после чего удалите
строку, в которой станавливается  значение ``activeLis``. Далее, перейдите в
``app/js/views/lists/menuitem.js`` и доработайте метод ``open``, чтобы там
осталась только ссылка на представление:

.. code-block:: javascript

    open: function() {
      if (bTask.views.activeListMenuItem) {
        bTask.views.activeListMenuItem.$el.removeClass('active');
      }

      bTask.views.activeListMenuItem = this;
      this.$el.addClass('active');

      return false;
    }

Теперь перейдём к классу ``AppView`` в файле ``app/js/views/app.js`` и
убедимся, что ``editList`` использует ``bTask.views.activeListMenuItem.model``.
И наконец, в ``app/js/views/lists/menu.js`` сделаем активацию элемента по
умолчанию (первый список):

.. code-block:: javascript

    renderMenuItem: function(model) {
      var item = new ListMenuItemView({ model: model });
      this.$el.append(item.render().el);

      if (!bTask.views.activeListMenuItem) {
        bTask.views.activeListMenuItem = item;
      }

      if (model.get('id') === bTask.views.activeListMenuItem.model.get('id')) {
        item.open();
      }
    },

Мне кажется, что то, что Backbone избегает отслеживания внутреннего состояния
приложения — это ошибка. Хотя, вероятно, это сильно зависит от типа приложения.

Чтобы интерфейс был более приятным, можно добавить в ``app/css/app.css``:

.. code-block:: css

    li.active { font-weight: bold }

Итоги
=====

В этой части мы работали с кодом из предыдущей части (:doc:`backbone-tutorial-6`),
пытаясь сделать списки редактируемыми. Несмотря на то, что это могло бы показаться
простой операцией, пришлось добавить в приложение логику отслеживания активного
списка.

Главное правило в Backbone — это использование закэшированных объектов jQuery
(или Zepto). Именно по этой причине в коде много обращений типа: ``this.$el``,
а не ``$()``. У меня есть небольшое дополнение к этому правилу: представления
должны работать, избегая влияния состояния внешних объектов на них.

Все изменения — `одной пачкой <http://github.com/alexyoung/dailyjs-backbone-tutorial/tree/0953c5d7873fe3f7d176984e0337724be2b3386f>`_.

PS
==

(прим. переводчика)

Кажется, что в код закралась ещё одна бага. Так теперь, если просмотреть список
задач, то можно видеть, что они задваиваются. Это происходит потому, что
метод ``bTask.views.listMenu.renderMenuItem`` (класс ``ListMenuView``)
вызывается дважды для каждого элемента списка.

Обратить внимание необходимо на три блока кода.

``app/js/app.js``:

.. code-block:: javascript

    connectGapi: function() {
      var self = this;
      this.apiManager = new ApiManager(this);
      this.apiManager.on('ready', function() {
        self.collections.lists.fetch({
          data: { userId: '@me' },
          success: function(res) {
            self.views.listMenu.render();
          }
        });
      });
    }

``app/js/views/lists/menu.js``:

.. code-block:: javascript

    initialize: function() {
      this.collection.on('add', this.renderMenuItem, this);
    },

и там же в  ``app/js/views/lists/menu.js``:

.. code-block:: javascript

    render: function() {
      var $el = $(this.el)
        , self = this;

      this.collection.each(function(list) {
        self.renderMenuItem(list);
      });

      return this;
    }

Причина ошибки в том, что коллекция списков при добавлении нового элемента
всегда инициирует вызов ``renderMenuItem``. То есть, когда открывается главная
страница приложения и выполняется ``self.collections.lists.fetch``, то для
каждого элемента, полученного с сервера и добавленного в коллекцию, будет
выполнен метод ``renderMenuItem``. В результате чего, данный элемент будет
показан на странице. Но в нашем же случае, ещё есть функция обратного вызова,
отрабатывающая при успешном выполнении ``self.collections.lists.fetch``. В ней
вызывается метод ``self.views.listMenu.render``, в котором выполняется
еще один проход по каждому элементу коллекции и для для каждого из них
вызывается ``renderMenuItem``. То есть, чтобы ликвидировать ошибку, достаточно
избавить от вызова ``self.views.listMenu.render``. Иначе говоря, метод
``connectGapi`` в ``app/js/app.js`` должен иметь следующий вид:

.. code-block:: javascript

    connectGapi: function() {
      var self = this;
      this.apiManager = new ApiManager(this);
      this.apiManager.on('ready', function() {
        self.collections.lists.fetch({
          data: { userId: '@me' }
        });
      });
    }
