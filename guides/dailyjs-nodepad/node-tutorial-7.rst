================================================
Хитрости в Jade и свои страницы ошибок в Express
================================================

Добро пожаловать в седьмую часть руководства по созданию веб-приложения
с помощью **Node.js**. В рамках серии уроков будет рассказано про основные
особенности и трудности, которые возникают при работе с Node.js.

Предыдущие части:

- :doc:`node-tutorial-1`
- :doc:`node-tutorial-2`, коммит: `4ea936b`_
- :doc:`node-tutorial-3`, коммит: `39e66cb`_
- :doc:`node-tutorial-4`, коммит: `f66fdb5`_
- :doc:`node-tutorial-5`, коммит: `03fe9b2`_
- :doc:`node-tutorial-6`, коммит: `f2261c5`_

.. _4ea936b: https://github.com/alexyoung/nodepad/tree/4ea936b4b426012528fc722c7576391b48d5a0b7
.. _39e66cb: https://github.com/alexyoung/nodepad/tree/39e66cb9d11a67044495beb0de1934ac4d9c4786
.. _f66fdb5: https://github.com/alexyoung/nodepad/tree/f66fdb5c3bebdf693f62884ffc06a40b93328bb5
.. _03fe9b2: https://github.com/alexyoung/nodepad/tree/03fe9b272fea1beb98ffefcf5f7ed226c81c49fd
.. _f2261c5: https://github.com/alexyoung/nodepad/tree/f2261c510c987b35df1e6e000be6e1e591cd9d6d

Версии node.js пакетов
======================

Для установки пакетов мы использовали `npm`, который настраивает пути таким
образом, что пакет может быть загружен с указанием конкртеной версии. Чтобы
установить пакет конкретной версии, необходимо выполнить::

    npm install express@1.0.0

Чтобы использовать установленную версию, необходимо делать так:

.. code-block:: javascript

    var express = require('express@1.0.0');

Убедиться в работоспособности такого подхода легко — достаточно выполнить
выше указанную строчку в консоли ``node``::

    $ node
    > express = require('express@1.0.0')
    { version: '1.0.0'
    , Server: { [Function: Server] parseQueryString: [Function] }
    , createServer: [Function]
    }

Хитрости в Jade
===============

При :ref:`изначальной реализации <init-jade-tpl>` jade-шаблонов я жестко
прописал все атрибуты. Однако, есть более лугкий путь — запись селекторов
в виде сокращений классов и идентификаторов:

.. code-block:: javascript

    div#left.outline-view
      div#DocumentTitles
        ul#document-list
          - for (var d in documents)
            li
              a(id='document-title-' + documents[d].id, href='/documents/' + documents[d].id)
                =documents[d].title

Обратите внимание, что ID объединен с названием класса:
``div#left.outline-view``.

В jade тэг по-умолчанию — это ``div``, что означает, что предыдущий пример
может быть переписан следующий образом:

.. code-block:: javascript

    #left.outline-view
      #DocumentTitles
        ul#document-list
          - for (var d in documents)
            li
              a(id='document-title-' + documents[d].id, href='/documents/' + documents[d].id)
                =documents[d].title

Страницы ошибок
===============

Express позволяет определять «свои» обработчики ошибок с помощью ``app.error``:

.. code-block:: javascript

    // Определение ошибки
    function NotFound(msg) {
      this.name = 'NotFound';
      Error.call(this, msg);
      Error.captureStackTrace(this, arguments.callee);
    }

    sys.inherits(NotFound, Error);

    // Этот метод приведет к отображению 500-ой ошибки
    app.get('/bad', function(req, res) {
      unknownMethod();
    });

    app.error(function(err, req, res, next) {
      if (err instanceof NotFound) {
        res.render('404.jade', { status: 404 });
      } else {
        next(err);
      }
    });

    app.error(function(err, req, res) {
      res.render('500.jade', {
        status: 500,
        locals: {
          error: err
        } 
      });
    });

Обработчик ощибки принимает 4 параметра: error, req, res, и next. ``next``
позволяет передать управление следующему обработчику ошибок. В приведенном
выше примере, обработчик 404-ой ошибки передает управление дальше, если
ошибка не является ``NotFound``, что приводит к тому, что все остальные
ошибки ловятся в обработчике 500-ой ошибки.

Если перейти в браузере по адресу ``/bad``, то в результате получим нашу
страницу 500-ой ошибки. Обратите внимание, что я явно указываю код
HTTP-ответа в настройках метода ``render`` — это очень важно. В противном
случае, вместо ошибок 404 или 500 будет возвращаться код 200, обозначющий,
что «всё хорошо».

Обработка ошибок в Mongoose
===========================

Функция ``next`` доступна во всех HTTP-методах нашего приложения, что
означает, что мы можем им воспользоваться для показа «своей» 404-ой ошибки:

.. code-block:: javascript

    app.get('/documents/:id.:format?/edit', loadUser, function(req, res, next) {
      Document.findById(req.params.id, function(d) {
        if (!d) return next(new NotFound('Document not found'));
        // Иначе — отрисовать текущий шаблон …
      });
    })

При использовании Mongoose это наиболее читабельный вариант генерации «своих»
ошибок. Если просто выбросить исключение (``throw new NotFound``), то
приложение упадет вместо вызова обработчика исключений.

Заключение
==========

При распространении или развертывании node-приложений очень важно
учитывать версии пакетов. Много ключевых пакетов до сих пор находятся в
стадии активной разработки, так что их установка иногда может вызывать
проблемы.

Express позволяет достаточно легко определять «свои» обработчики ошибок
с помощью шаблонов, но очень важно не забывать указывать HTTP код ответа
и использовать ``next(exception)`` в функциях обратного вызова.

Текущая версия *Nodepad* доступна в коммите 929f564_.

.. _929f564: https://github.com/alexyoung/nodepad/tree/929f5642ca1b2fa664df517457e056c92490d892
