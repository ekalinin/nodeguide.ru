=====================
Улучшаем тестирование
=====================

Добро пожаловать в одиннадцатую часть руководства по созданию веб-приложения
с помощью **Node.js**. В рамках серии уроков будет рассказано про основные
особенности и трудности, которые возникают при работе с Node.js.

Предыдущие части:

- :doc:`node-tutorial-1`
- :doc:`node-tutorial-2`, коммит: 4ea936b_
- :doc:`node-tutorial-3`, коммит: 39e66cb_
- :doc:`node-tutorial-4`, коммит: f66fdb5_
- :doc:`node-tutorial-5`, коммит: 03fe9b2_
- :doc:`node-tutorial-6`, коммит: f2261c5_
- :doc:`node-tutorial-7`, коммит: 929f564_
- :doc:`node-tutorial-8`, коммит: df0b954_
- :doc:`node-tutorial-9`, коммит: 1904c6b_
- :doc:`node-tutorial-10`, коммит: 11d33e1_

.. _4ea936b: https://github.com/alexyoung/nodepad/tree/4ea936b4b426012528fc722c7576391b48d5a0b7
.. _39e66cb: https://github.com/alexyoung/nodepad/tree/39e66cb9d11a67044495beb0de1934ac4d9c4786
.. _f66fdb5: https://github.com/alexyoung/nodepad/tree/f66fdb5c3bebdf693f62884ffc06a40b93328bb5
.. _03fe9b2: https://github.com/alexyoung/nodepad/tree/03fe9b272fea1beb98ffefcf5f7ed226c81c49fd
.. _f2261c5: https://github.com/alexyoung/nodepad/tree/f2261c510c987b35df1e6e000be6e1e591cd9d6d
.. _929f564: https://github.com/alexyoung/nodepad/tree/929f5642ca1b2fa664df517457e056c92490d892
.. _df0b954: https://github.com/alexyoung/nodepad/tree/df0b954b3c4e83a69ab4cfe2d87f2fb1d0ffa162
.. _1904c6b: https://github.com/alexyoung/nodepad/tree/1904c6b7f95d708474a5d42e8cdfd40e96243a7a
.. _11d33e1: https://github.com/alexyoung/nodepad/tree/11d33e19066e76c8559857fb780ac9fd1ecf68ac

Check Out для каждого коммита
=============================

Вы, наверное, уже заметили, что я добавляю часть SHA1-хэша для каждого коммита.
Делается это для того, чтобы можно было скачать отдельную часть кода данного
руководства. Делается это очень просто:

.. code-block:: bash

    git clone git://github.com/alexyoung/nodepad.git
    git checkout -b tutorial_8 df0b954

Эта команда создаст новую локальную ветку, которая будет соответствовать
состоянию репозитория при коммите df0b954_. Имя ветки задается в части
``-b tutorial_8``, так что можно без проблем создать по ветке хоть на
каждый коммит и переключаться между ними.


Ошибки и улучшения
==================

В выходные Matthias Lübken помог мне разобраться с некоторыми странностями
в Nodepad. У нас была достаточно долгая дискуссия в GitHub и Twitter, в
результате которой мы пришли к выводу, что Nodepad не очень хорошо работает
на Node 0.3.x (сейчас уже Node 0.4.x, прим. перев.). Так что я рекомендую
использовать, по-возможности, 0.2.4.

В DailyJS мы уже рассматривали один из менеджеров версий Node.js — n_.
Так что его вполне можно использовать для того, чтобы переключаться
между 0.2.x и 0.3.x ветками. Еще одним иструментом, позволяющий это сделать,
является nvm_.

.. note::

    Еще одним инструментом, позволяющим работать одновременно с несколькими версиями
    node.js, является утилита nodeenv_.

.. _n: https://github.com/visionmedia/n
.. _nvm: https://github.com/creationix/nvm
.. _nodeenv: https://github.com/ekalinin/nodeenv

Кроме того, Matthias обнаружил, что при использовании последней версии Jade
в flash-сообщениях выдается escaped HTML. Это `не будет исправляться`_.

.. _не будет исправляться: https://github.com/alexyoung/nodepad/commit/afc1eba719182fba4ed4aaaed87e60bbbfd9c0e2

Matthias так же предложил, что для большей безопасности следует использовать
`секретный ключ`_. Вам так же следует, по-возможности, всегда использовать
настройку ``secret`` для ``express.session``.

.. _секретный ключ: https://github.com/alexyoung/nodepad/commit/719afcfe97ac227eb7708d6f29a4cd2132b17c2d

Тестирование с Expresso и Zombie.js
===================================

Ранее написанные тесты больше не работают. Это частично моя вина, но так же
значительную роль в этом сыграло отсутствие хороших руководств по тестированию
с помощью Expresso. Как и большинству наших читателей, мне комфортно с серверным
JavaScript и клиентскими утилитами, которые заставили меня задаться вопросом,
было бы легче писать тесты в стиле, который отражает это. Поэтому я решил совместить
Expresso_ и Zombie.js_.

Так что я пошел на поиски, чтобы написать идиоматический тестовый код с помощью
Expresso, Zombie.js и Mongoose. У меня получился следующий скелет:

.. code-block:: javascript

    // Используем тестовое окружение
    process.env.NODE_ENV = 'test';

    var app = require('../app'),
        path = require('path'),
        fs = require('fs'),
        assert = require('assert'),
        zombie = require('zombie'),
        events = require('events'),
        testRunner = require('./runner'),
        models;

    // Модели Mongoose, определенные в приложении.
    // На самом деле, я экспортирую их как app.User
    models = ['User'];

    function removeTestData(models, next) {
      // Удаляем тестовые данные
    }

    (function() {
      // Запускаем приложение, чтобы проверить его из Zombie
      app.listen(3001);

      // Чистим данные на каждом запуске
      removeTestData(models, function() {
        // Заготовочка / Фикстура
        var user = new app.User({
                'email' : 'alex@example.com',
                'password' : 'test'
            });
        user.save(start);
      });
    })();

    function teardown() {
      removeTestData(models, function() {
        process.exit();
      });
    }

    function start() {
      exports['test login'] = function() {
        // Тут будет код Zombie
      };
    }

Всё начинается с само-исполняемой анонимной функции. Она запускает приложение
на отдельном порту, очищает тестовые данные и создает пользователя. Всё это
выполняется асинхронно, так что, если у нас есть несколько фикстур, то в самом
последнем вызове ``save`` должна вызывать функция ``start``. Expresso будет
ждать пока не проэкспортируются все тесты, что позволяет нам использовать
асинхронное Mongoose API и запускать тесты тогда, когда у нас всё готово.

Если вам всё понятно, то взгляните на следующий код теста:

.. code-block:: javascript

    // Используем тестовое окружение
    process.env.NODE_ENV = 'test';

    var app = require('../app'),
        path = require('path'),
        fs = require('fs'),
        assert = require('assert'),
        zombie = require('zombie'),
        events = require('events'),
        testRunner = require('./runner'),
        models;

    models = ['User'];

    function removeTestData(models, next) {
      var modelCount = models.length;
      models.forEach(function(modelName) {
        modelCount--;
        app[modelName].find().all(function(records) {
          var count = records.length;
          records.forEach(function(result) {
            result.remove();
            count--;
          });
          if (count === 0 && modelCount === 0) next();
        });
      });
    }

    (function() {
      // Запускаем приложение, чтобы проверить его из Zombie
      app.listen(3001);

      // Чистим данные на каждом запуске
      removeTestData(models, function() {
        // Заготовочка / Фикстура
        var user = new app.User({
                'email' : 'alex@example.com',
                'password' : 'test'
            });
        user.save(start);
      });
    })();

    function teardown() {
      removeTestData(models, function() {
        process.exit();
      });
    }

    function start() {
      exports['test login'] = function() {
        zombie.visit('http://localhost:3001/', function(err, browser, status) {
          // Заполняем email/пароль и подтверждаем форму
          browser.
            fill('user[email]', 'alex@example.com').
            fill('user[password]', 'test').
            pressButton('Log In', function(err, browser, status) {
              // Форма подтверждена, новая страница загружена
              assert.equal(browser.text('#header a.destroy'), 'Log Out');
              teardown();
            });
        });
      };
    }

Код Zombie.js делает запрос на указанный URL (обратите внимание, что
используется 3001 порт), после чего используя объект ``browser`` заполняется
форма входа и подтверждается. После чего, используя стандартный ``assert.equal``,
сравнивается текстовый узел со строкой 'Log Out'.

Формализуем процесс
===================

Если мы хотим разделить тесты для Nodepad на несколько файлов, то повторение
кода для Mongo фикстур будет выглядеть не очень хорошо. Поэтому попытаемся
формализовать работу с фикстурами. Вот мой `test/helper.js`_ файл:

.. _test/helper.js: https://github.com/alexyoung/nodepad/blob/6a269ce4ddb6c7dc78598b488c93b38828fb5763/test/helper.js

.. code-block:: javascript

    // Устанавливаем тестовое окружение
    process.env.NODE_ENV = 'test';
    var state = {
      models: []
    };

    function prepare(models, next) {
      var modelCount = models.length;
      models.forEach(function(model) {
        modelCount--;
        model.find().all(function(records) {
          var count = records.length;
          records.forEach(function(result) {
            result.remove();
            count--;
          });
          if (count === 0 && modelCount === 0) next();
        });
      });
    };

    module.exports = {
      run: function(e) {
        for (var test in state.tests) {
          e[test] = state.tests[test];
        }
      },

      setup: function(next) {
        prepare(state.models, next);
      },

      end: function() {
        prepare(state.models, process.exit);
      },

      set models(models) {
        state.models = models;
      },

      set tests(tests) {
        state.tests = tests;
      }
    };

Чтобы безопасно удалять данные после каждого запуска набора тестов, я в
настройках Nodepad'a определил БД test и именно для этой цели я принудительно
устанавливаю окружение ``test``. Функция ``prepare`` обходит все модели Mongoose
и удаляет все ассоциированные данные (этот фрагмент взят из предыдущего примера).

Теперь тесты стали немного короче:

.. code-block:: javascript

    var app = require('../app'),
        assert = require('assert'),
        zombie = require('zombie'),
        events = require('events'),
        testHelper = require('./helper');

    app.listen(3001);

    testHelper.models = [app.User];

    testHelper.setup(function() {
      // Фикстуры
      var user = new app.User({
            'email' : 'alex@example.com',
            'password' : 'test'
          });
      user.save(testHelper.run(exports));
    });

    testHelper.tests = {
      'test login': function() {
        zombie.visit('http://localhost:3001/', function(err, browser, status) {
          // Заполняем email, пароль и подтверждаем форму
          browser.
            fill('user[email]', 'alex@example.com').
            fill('user[password]', 'test').
            pressButton('Log In', function(err, browser, status) {
              // Форма подтверждена, загружена новая форма
              assert.equal(browser.text('#header a.destroy'), 'Log Out');
              testHelper.end();
            });
        });
      }
    };

Обратили внимание, что я использовал сеттер для указания тестов и моделей?
Я считаю, что это был интересный ходи решил его оставить.

Заключение
==========

При написании тестов с Expresso важно помнить, что есть возможность откладывать
запуск тестов, установив настройки в ``module.exports``. В документации по `Expresso`_
TJ использует ``setTimeout``, но помимо это можно пользовать и функциями обратного
вызова (callback).


Если вы запустите мой код (не забудьте использовать ``expresso``), то должны
увидеть следущий результат:

.. code-block:: bash

    alex@mog ~/Code/nodepad[git:master]$ expresso test/app.test.js 
    GET / 2 ms
    GET /sessions/new 10 ms
    GET /javascripts/application.js 1 ms
    GET /javascripts/json.js 1 ms
    POST /sessions 2 ms
    GET /documents 8 ms
    GET /javascripts/application.js 1 ms
    GET /javascripts/json.js 1 ms
    GET /documents/4d21d96f2410f20000000037.json 5 ms

       100% 1 tests

Zombie.js (или Tobi_) — очень удобный для JavaScript разработчика способ
тестирования, но при его использовании необходим какой-либо «запускатель»
тестов. Многие используют Vows_, а так же, я думаю, nodeunit - будет тоже
хорошо работать.

К сожалению, далеко не многие приложения с открытыми исходными кодами,
написанные с помощью Express имеют полноценный набор тестов. Кроме того,
создание тестов без возможности обработки запуска тестов, окончания работы
тестов и загрузки фикстур — не очень удобно использовать.

Теперь, вы, по крайней мере, способны запустить тесты для Nodepad. Надеюсь,
что на следующей неделе я смогу показать более подробный тест на Zombie.js.

Комит для текущей части — 6a269ce_.

.. _6a269ce: https://github.com/alexyoung/nodepad/tree/6a269ce4ddb6c7dc78598b488c93b38828fb5763

Ссылки
======

  * Zombie.js_
  * Tobi_
  * Vows_
  * Expresso_

.. _Tobi: https://github.com/LearnBoost/tobi
.. _Vows: http://vowsjs.org/
.. _Zombie.js: http://zombie.labnotes.org/
.. _Expresso: http://visionmedia.github.com/expresso/
