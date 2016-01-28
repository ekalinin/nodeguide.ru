=====================================================
Node.js модули, о которых вы должны знать: express.js
=====================================================

Всем привет! Это десятый пост в моей серии статей :doc:`index`.

Первый пост был про :doc:`dnode <dnode>` — фристайл RPC библиотеку для
node.js. Второй пост был посвящен :doc:`optimist <optimist>` — легковесному
парсеру командной строки для node.js. Третий был про :doc:`lazy <lazy>` —
ленивые списки для node.js. Четвертый — про :doc:`request <request>` —
швецарский нож HTTP стримминга. Пятый был про :doc:`hashish <hashish>` —
библиотеку для работы с хэшами. Шестой пост касался :doc:`read <read>` —
обертки для чтения со стандратного потока ввода (stdin). Седьмой был про
:doc:`ntwitter <ntwitter>` — twitter API для node.js. Восьмой пост был
посвящён :doc:`socket.io <socketio>`, который делает возможным websockets
во всех браузерах. Девятый пост касался :doc:`redis <redis>` — лучшего
redis-клиента для node.js.

В сегодняшней заметке я хочу рассказать про express_ — очень маленьком
и быстром серверном веб-фреймворке, построенном на базе connect_. Автором
express_ является :ref:`TJ Holowaychuk <tj-holowaychuk>`. TJ является
автором 85 модулей для node.js, так что вероятность того, что в этой
серии появятся еще его модули очень высока.

.. _express: http://expressjs.com/
.. _connect: https://github.com/senchalabs/connect

Вот пример:

.. code-block:: javascript

    var express = require('express');
    var app = express.createServer();

    app.get('/', function(req, res){
        res.send('Hello World');
    });

    app.listen(3000);

Тут создается web-сервер, «слушающий» порт 3000 и обрабатывающий запрос к ``/``,
ответом на который выводится строка ``Hello World``.

В **express** встроена мощная система маршрутизации. Например:

.. code-block:: javascript

    app.get('/user/:id', function(req, res){
        res.send('user ' + req.params.id);
    });

Данный код обрабатывает запросы ``/user/foo``, для которых автоматически
выставляется значение ``foo`` для переменной ``req.params.id``. Для
описания маршрутов вы так же можете использовать регулярные выражения.

Если вы хотите обрабатывать ``POST`` запросы, то вашему приложению необходимо
использовать специальный middleware — ``bodyParser``. Подключается он очень
легко: ``app.use(express.bodyParser())``. BodyParser обрабатывает тела
``application/x-www-form-urlencoded`` и ``application/json`` запросов и
выставляет для них ``req.body``. Вот пример:

.. code-block:: javascript

    app.use(express.bodyParser());

    app.post('/', function(req, res){
        console.log(req.body.foo);
        res.send('ok');
    });

В данном примере на консоль выводится значение переменной ``foo`` из тела
запроса, а в ответ на запрос возвращается строка ``ok``.

Кроме ``bodyParser`` доступно еще несколько middleware'ей:

.. code-block:: javascript

    app.use(express.logger(...));
    app.use(express.cookieParser(...));
    app.use(express.session(...));
    app.use(express.static(...));
    app.use(express.errorHandler(...));

``logger`` отвечает за логирование HTTP запросов, ``cookieParser`` — за
обработку cookies, ``session`` — за работу с сессиями, ``static`` — за
работу со статическим контентом (css, javascript, картинки), ``errorHandler`` —
за обработку ошибок. Более подробно о них можно узнать из `документации`_.

.. _документации: http://expressjs.com/guide.html#middleware

Кроме того, **express** имеет поддержку различных шаблонных движков.
Например, моего любимого шаблонного языка jade_ (автором так же является
TJ). Вот пример использования **jade** с **express**:

.. _jade: http://jade-lang.com/

.. code-block:: javascript

    app.get('/', function(req, res){
        res.render('index.jade', { title: 'My Site' });
    });

Имена файлов шаблонов имеют вид ``<имя>.<движок>``, где ``<движок>`` —
имя модуля, который необходим для обработки тела шаблона. Например,
шаблон ``layout.ejs`` «сообщит» **express**, что необходимо сделать
``require('ejs')`` перед обработкой шаблона. Загружаемый модуль должен
экспортировать метод ``exports.compile(str, options)`` и возвращать
``Function``.

Основные возможности **express**:

* гибкая система маршрутизации запросов
* перенаправления
* динамические представления
* уточнение контента
* особое внимание производительности
* обработка представлений и поддержка частичных шаблонов
* поддержка конфигураций на основе окружений
* оповещения, интегрированные с сессиями
* максимальное покрытие тестами
* утилиты для быстрой генерации остова приложений
* настройки представлений на уровне приложений

Кроме того:

* поддержка сессий
* кэш API
* поддержка mime
* поддержка ETag
* постоянные оповещения
* поддержка кук
* JSON RPC
* логирование

Для первого знакомства будет не лишним посмотреть `скринкаст`_ про
**express** от TJ. Для ознакомления с примерами можно взглянуть на
директорию examples_ в исходном коде фреймворка. Так же для
**express** есть шикарная `документация`_.

.. _скринкаст: http://www.screenr.com/mAL
.. _examples: https://github.com/visionmedia/express/tree/master/examples
.. _документация: http://expressjs.com/guide.html

Установка express тривиальна::

    npm install express
