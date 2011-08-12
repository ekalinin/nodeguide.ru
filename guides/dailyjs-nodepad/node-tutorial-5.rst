===================================================
Аутентификация, сессии и контроль доступа в Express
===================================================

Добро пожаловать в пятую часть руководства по созданию веб-приложения
с помощью **Node.js**. В рамках серии уроков будет рассказано про основные
особенности и трудности, которые возникают при работе с Node.js.

Предыдущие части:

- :doc:`node-tutorial-1`
- :doc:`node-tutorial-2`, коммит: `4ea936b`_
- :doc:`node-tutorial-3`, коммит: `39e66cb`_
- :doc:`node-tutorial-4`, коммит: `f66fdb5`_

.. _4ea936b: https://github.com/alexyoung/nodepad/tree/4ea936b4b426012528fc722c7576391b48d5a0b7
.. _39e66cb: https://github.com/alexyoung/nodepad/tree/39e66cb9d11a67044495beb0de1934ac4d9c4786
.. _f66fdb5: https://github.com/alexyoung/nodepad/tree/f66fdb5c3bebdf693f62884ffc06a40b93328bb5

Аутентификация
==============

Мы уже сделали достаточно полезное приложение. Но оно было бы еще более
полезным, если бы имело какое-либо подобие системы аутентификации. Даже не
смотря на то, что в миру набирают обороты такие технологии, как **OpenID**
и **OAuth**, большинство коммерческих проектов предпочитают иметь свою
собственную систему входа.

Обычно она реализуется с помощью сессий:

- Пользователь заполняет форму, указывая логин и пароль
- Пароль шифруется с помощью хэш-алгоритма
- Полученное значение сравнивается с тем, что хранится в БД
- Если они совпадают, то генерируется сессионный ключ, идентифицирующий
  пользователя

Для реализации пользовательских сессий нам нужно следующее:

- Пользователь в БД
- Сессии, в которых можно хранить идентификатор пользователя
- Шифрование пароля
- Возможность ограничения доступа к тем URL, для которых требуется
  залогиненный пользователь

Сессии в Express
================

В основе **сессий в Express** лежит соответствующий средний слой (middleware)
из Connect, который, в свою очередь, опирается на механизм хранения данных.
Существует хранилище в памяти, а так же сторонние хранилища, включая
connect-redis_ и connect-mongodb_. В качестве альтернативы так же можно
рассматривать cookie-sessions_, который хранит данные сессии в пользовательской
куке (cookie).

.. _connect-redis: https://github.com/visionmedia/connect-redis
.. _connect-mongodb: https://github.com/masylum/connect-mongodb
.. _cookie-sessions: https://github.com/caolan/cookie-sessions

Поддержка сессий может быть включена следующим образом:

.. code-block:: javascript

    app.use(express.cookieDecoder());
    app.use(express.session());

Размещение этого кода в разделе конфигурации приложения очень важно. В случае
ошибки сессионная переменная не появится в объекте запроса. Я разместил этот
кусок между ``bodyDecoder`` и ``methodOverride``. Полную версию кода Вы можете
посмотреть на GitHub.

Теперь в HTTP-обработчиках будет доступна переменная ``req.session``:

.. code-block:: javascript

    app.get('/item', function(req, res) {
      req.session.message = 'Hello World';
    });

.. _mongodb-sessions:

Сессии в MongoDB
================

Для поддержки **сессий в MongoDB** необходимо установить connect-mongodb_:

.. code-block:: bash

    npm install connect-mongodb

Работает connect-mongodb так же как и любое другое хранилище сессий. Во
время настройки приложения необходимо указать детали соединения:

.. code-block:: javascript

    app.configure('development', function() {
      app.set('db-uri', 'mongodb://localhost/nodepad-development');
    });

    var db = mongoose.connect(app.set('db-uri'));

    function mongoStoreConnectionArgs() {
      return { dbname: db.db.databaseName,
               host: db.db.serverConfig.host,
               port: db.db.serverConfig.port,
               username: db.uri.username,
               password: db.uri.password };
    }

    app.use(express.session({
      store: mongoStore(mongoStoreConnectionArgs())
    }));

Большая часть этого кода не понадобилась бы, если бы авторы API реализовали
стандартный формат настроек соединения. Я написал функцию, извлекающую
настройки соединения из Mongoose. В этом примере, переменная ``db`` хранит
экземпляр соединения Mongoose, который ждет настроек соединения в виде URI.
Этот формат, кстати, мне более всего симпатичен из-за своей простоты и
легкости для запоминания. Строку соединения я сохраняю с помощью ``app.set``.

При работе с Express бывает полезно использовать ``app.set('name', 'value')``.
Так же следует запомнить, что для доступа к настройке следует использовать
``app.set('name')``, а не ``app.get``.

Теперь, запустив в консоли Mongo ``db.sessions.find()``, можно увидеть все
созданные сессии.

Контроль доступа
================

Express предоставляет элегатный способ по ограничению доступа для залогиненных
пользователей. При определения HTTP-обработчика может быть задан необязательный
параметр маршрутизации:

.. code-block:: javascript

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
      } else {
        res.redirect('/sessions/new');
      }
    }

    app.get('/documents.:format?', loadUser, function(req, res) {
      // ...
    });

Теперь доступ к адресу (URL), требующему только авторизованных пользователей,
может быть ограничен простым добавлением ``loadUser`` в соответствующий
HTTP-обработчик. Вспомогательная функция принимает те же параметры, что и
обычный обработчик, плюс один дополнительный параметр ``next``. Последний
позволяет использовать дополнительную логику перед непосредственным вызовом
функции обработчика адреса. В нашем проекте, пользователь загружается,
используя сессионую переменную ``user_id``. Если пользователь не найден,
то функция ``next`` не вызывается и происход переадресация на окно ввода
логина/пароля.

RESTful подход к сессиям
========================

Я сделал сессии таким же образом, как и документы. Добавил адреса для
создания, удаления и получения сессий:

.. code-block:: javascript

    // Сессии
    app.get('/sessions/new', function(req, res) {
      res.render('sessions/new.jade', {
        locals: { user: new User() }
      });
    });

    app.post('/sessions', function(req, res) {
      // Найти пользователя и выставить currentUser
    });

    app.del('/sessions', loadUser, function(req, res) {
      // Удалить сессию
      if (req.session) {
        req.session.destroy(function() {});
      }
      res.redirect('/sessions/new');
    });

Модель пользователя
===================

Модель пользователя ``User`` немного сложнее, чем модель документа
``Document``, так как в ней будет содержаться код связанный с авторизацией.
Я использовал следующую стртегию, которую, вероятно, Вы уже видели ранее
в объектно-ориентированных веб фреймворках:

- Пароли хранятся в виде хэша
- Аутентификация выполняется сравнением зашифрованного текста, указанного
  пользователем, и паролем-хэшем, хранящимся в БД для пользователя
- Виртуальное свойство ``password`` хранит пароль в текстовом виде для
  удобства в формах регистрации и входа
- У свойства есть сеттер, который автоматически конвертирует текст пароля
  в хэш перед сохранением
- Используется уникальный индекс для поля email, чтобы гарантировать, что
  у каждого пользователя свой собственный email

Шифрование пароля использует стандартную Node.js библиотеку ``crypto``:

.. code-block:: javascript

    var crypto = require('crypto');

    mongoose.model('User', {
      methods: {
        encryptPassword: function(password) {
          return crypto.createHmac('sha1', this.salt).
                        update(password).
                        digest('hex');
        }
      }
    });

``encryptPassword`` - метод экземпляра, возвращающий sha1-хэш для текстового
пароля и некоторой соли. Соль генерируется перед щифрованием в сеттере пароля:

.. code-block:: javascript

    mongoose.model('User', {
      // ...

      setters: {
        password: function(password) {
          this._password = password;
          this.salt = this.makeSalt();
          this.hashed_password = this.encryptPassword(password);
        }
      },

      methods: {
        authenticate: function(plainText) {
          return this.encryptPassword(plainText) === this.hashed_password;
        },

        makeSalt: function() {
          return Math.round((new Date().valueOf() * Math.random())) + '';
        },

        // ...

Солью может быть всё, что угодно. Я, в данном примере, генерирую случайную
строку.

Сохранение пользователей и регистрация
======================================

Mongoose позволяет изменять поведение модели при сохранении с помощью
переопределения метода ``save``:

.. code-block:: javascript

    mongoose.model('User', {
      // ...
      methods: {
        // ...

        save: function(okFn, failedFn) {
          if (this.isValid()) {
            this.__super__(okFn);
          } else {
            failedFn();
          }
        }

        // ...

Я переопределил метод ``save``, чтобы была возможность обработки неудачного
сохранения модели. Это облегчит обработку ошибок при регистрации:

.. code-block:: javascript

    app.post('/users.:format?', function(req, res) {
      var user = new User(req.body.user);

      function userSaved() {
        switch (req.params.format) {
          case 'json':
            res.send(user.__doc);
          break;

          default:
            req.session.user_id = user.id;
            res.redirect('/documents');
        }
      }

      function userSaveFailed() {
        res.render('users/new.jade', {
          locals: { user: user }
        });
      }

      user.save(userSaved, userSaveFailed);
    });

Пока не выводится никаких сообщений об ошибках. Это будет добавлено в одной из
следующих частей.

Несмотря на всю простоту этой проверки, индекс критически важен для приложения:

.. code-block:: javascript

    mongoose.model('User', {
      // ...

      indexes: [
        [{ email: 1 }, { unique: true }]
      ],

      // ...
    });

Эта проверка предотвратит дублирование пользователей при сохранении.

Заключение
==========

После коммита `03fe9b2`_ мы имеем следующее:

- Сессии в MongoDB
- Модель пользователя с поддержкой шифрования пароля алгоритмом sha-1
- Контроль доступа к документам
- Регистрацию и аутентифкацию пользователей
- Управление сессиями

Я немного обновил Jade шаблоны и добавил форму входа.

Есть, однако, несколько моментов, пока не реализованных в текущей версии
приложения:

- Документы ничего не знают о своем владельце
- Тесты работают неправильно, так как у меня появились проблемы при анализе
  того, как Expresso работает с сессиями

Со всем этим мы разберемся в следующих частях руководства.

.. _03fe9b2: https://github.com/alexyoung/nodepad/tree/03fe9b272fea1beb98ffefcf5f7ed226c81c49fd
