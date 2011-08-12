========================
Функция «Запомнить меня»
========================

Добро пожаловать в девятую часть руководства по созданию веб-приложения
с помощью **Node.js**. В рамках серии уроков будет рассказано про основные
особенности и трудности, которые возникают при работе с Node.js.

Предыдущие части:

- :doc:`node-tutorial-1`
- :doc:`node-tutorial-2`, коммит: `4ea936b`_
- :doc:`node-tutorial-3`, коммит: `39e66cb`_
- :doc:`node-tutorial-4`, коммит: `f66fdb5`_
- :doc:`node-tutorial-5`, коммит: `03fe9b2`_
- :doc:`node-tutorial-6`, коммит: `f2261c5`_
- :doc:`node-tutorial-7`, коммит: `929f564`_
- :doc:`node-tutorial-8`, коммит: `df0b954`_

.. _4ea936b: https://github.com/alexyoung/nodepad/tree/4ea936b4b426012528fc722c7576391b48d5a0b7
.. _39e66cb: https://github.com/alexyoung/nodepad/tree/39e66cb9d11a67044495beb0de1934ac4d9c4786
.. _f66fdb5: https://github.com/alexyoung/nodepad/tree/f66fdb5c3bebdf693f62884ffc06a40b93328bb5
.. _03fe9b2: https://github.com/alexyoung/nodepad/tree/03fe9b272fea1beb98ffefcf5f7ed226c81c49fd
.. _f2261c5: https://github.com/alexyoung/nodepad/tree/f2261c510c987b35df1e6e000be6e1e591cd9d6d
.. _929f564: https://github.com/alexyoung/nodepad/tree/929f5642ca1b2fa664df517457e056c92490d892
.. _df0b954: https://github.com/alexyoung/nodepad/tree/df0b954b3c4e83a69ab4cfe2d87f2fb1d0ffa162

Обновление connect-mongodb
==========================

В одной из предыдущих частей данной серии я написал небольшой хак ,
:ref:`приводящий строку соединения mongodb к формату<mongodb-sessions>`,
который понимает connect-mongodb_. Я связался с автором через GitHub, и
он достаточно быстро доработал библиотеку. Теперь она понимает формат
строки соединения connect-mongodb_. То есть, теперь функция 
``mongoStoreConnectionArgs`` нам не нужна.

.. _connect-mongodb: https://github.com/masylum/connect-mongodb

Чтобы установить конкретную версию пакета, необходимо выполнить::

    npm install connect-mongodb@0.1.1

А код, устанавливающий соединение, теперь выглядит так (``app.js``):

.. code-block:: javascript

    // Где-то в начале файла
    mongoStore = require('connect-mongodb@0.1.1')

    // Функцию mongoStoreConnectionArgs можно удалить

    // Код установки соединения с mongodb
    // в блоке настройки приложения
    app.use(express.session({
        store: mongoStore(app.set('db-uri')) 
    }));

Функция «Запомнить меня»
========================

Реализация данной функциональности требует некоторой доработки на стороне
сервера. Обычно реализуется следующая логика:

#. При входе создается дополнительная кука (cookie) «Запомнить меня»
#. Кука содержит имя пользователя и два случайных числа (ключ серии
   и случайный ключ)
#. Эти два ключа сохраняются в базе данных
#. Когда кто-то заходит на сайт, при этом он не залогинен и имеет куку,
   то она (кука) проверяется в БД. Ключи обновляются и возвращаются
   пользователю
#. Если имя пользователя совпадает, а ключи — нет, то пользователю
   выводится предупреждение, а все его сессии удаляются
#. В противном случае, кука игнорируется

Это схема разработана с целью предотвращения кражи куки и описана в
документе Барри Джаспэна (Barry Jaspan) — `Improved Persistent Login
Cookie Best Practice`_.

.. _Improved Persistent Login Cookie Best Practice: http://jaspan.com/improved_persistent_login_cookie_best_practice

Модель
======

В файле ``models.js`` я добавил модель ``LoginToken``:

.. code-block:: javascript

    mongoose.model('LoginToken', {
      properties: ['email', 'series', 'token'],

      indexes: [
        'email',
        'series',
        'token'
      ],

      methods: {
        randomToken: function() {
          return Math.round((new Date().valueOf() * Math.random())) + '';
        },

        save: function() {
          // Автоматически сохраняем ключи
          this.token = this.randomToken();
          this.series = this.randomToken();
          this.__super__();
        }
      },

      getters: {
        id: function() {
          return this._id.toHexString();
        }
      }
    });

    exports.LoginToken = function(db) {
      return db.model('LoginToken');
    };

    // Использовать следующим образом:
    // app.LoginToken = LoginToken = require('./models.js').LoginToken(db);


Это основная вещь. Она автоматически создает ключи при сохранении модели.

Представления
=============

Теперь добавим простой Jade-шаблон в ``views/sessions/new.jade``:

.. code-block:: javascript

    div
      label(for='remember_me') Remember me:
      input#remember_me(type='checkbox', name='remember_me')

Контроллер
==========

Далее необходимо доработать функцию-обработчик POST-запросов для сессий:
при необходимости должен создаваться ``LoginToken``:

.. code-block:: javascript

    app.post('/sessions', function(req, res) {
      User.find({ email: req.body.user.email }).first(function(user) {
        if (user && user.authenticate(req.body.user.password)) {
          req.session.user_id = user.id;

          // Запомнить меня
          if (req.body.remember_me) {
            var loginToken = new LoginToken({ email: user.email });
            loginToken.save(function() {
              res.cookie('logintoken', loginToken.cookieValue, {
                  expires: new Date(Date.now() + 2 * 604800000),
                  path: '/' 
              });
            });
          }

          res.redirect('/documents');
        } else {
          req.flash('error', 'Incorrect credentials');
          res.redirect('/sessions/new');
        }
      });
    });

При выходе ключи должны удаляться:

.. code-block:: javascript

    app.del('/sessions', loadUser, function(req, res) {
      if (req.session) {
        LoginToken.remove({ email: req.currentUser.email }, function() {});
        res.clearCookie('logintoken');
        req.session.destroy(function() {});
      }
      res.redirect('/sessions/new');
    });

Работа с Cookie в Express
=========================

API для работы с куками (cookie) в Express выклядит следующим образом:

.. code-block:: javascript

    // Создать куку
    res.cookie('key', 'value');

    // Прочитать куку
    req.cookies.key;

    // Удалить куку
    res.clearCookie('key');

Имена для кук всегда строчные. Обратите внимание, что все операции записи
куки выполняются через объект ответа (``res``), а операции чтения выполняются
через объект запроса (``req``).

Доработка функции loadUser
==========================

Далее необходимо добавить проверку наличия ``LoginToken`` в функцию среднего
слоя (middleware) ``loadUser``:

.. code-block:: javascript

    function authenticateFromLoginToken(req, res, next) {
      var cookie = JSON.parse(req.cookies.logintoken);

      LoginToken.find({ email: cookie.email,
                        series: cookie.series,
                        token: cookie.token })
                .first(function(token) {
        if (!token) {
          res.redirect('/sessions/new');
          return;
        }

        User.find({ email: token.email }).first(function(user) {
          if (user) {
            req.session.user_id = user.id;
            req.currentUser = user;

            token.token = token.randomToken();
            token.save(function() {
              res.cookie('logintoken', token.cookieValue, {
                  expires: new Date(Date.now() + 2 * 604800000),
                  path: '/' });
              next();
            });
          } else {
            res.redirect('/sessions/new');
          }
        });
      });
    }

    function loadUser(req, res, next) {
      if (req.session.user_id) {
        User.findById(req.session.user_id, function(user) {
          if (user) {
            req.currentUser = user;
            next();
          } else {
            res.redirect('/sessions/new');
          }
        });
      } else if (req.cookies.logintoken) {
        authenticateFromLoginToken(req, res, next);
      } else {
        res.redirect('/sessions/new');
      }
    }

Обратите внимание, что весь код, относящийся к проверке наличия
``LoginToken``, оформлен в отдельную функцию. Это способствует
сохранению читабельности кода функции ``loadUser``.

Заключение
==========

Выше приведен несколько упрощенный вариант алгоритма, который предложил
Бари Джаспан. Однако такой вариант способствует легкости понимания метода и
демонстрирует подходы для работы с куками в Express.

Код, относящийся к данной части, доступен в коммите 1904c6b_.

.. _1904c6b: https://github.com/alexyoung/nodepad/tree/1904c6b7f95d708474a5d42e8cdfd40e96243a7a

Ссылки
======

- `Руководство по Express <http://expressjs.com/guide.html>`_
- `Improved Persistent Login Cookie Best Practice <http://jaspan.com/improved_persistent_login_cookie_best_practice>`_
