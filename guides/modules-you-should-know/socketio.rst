====================================================
Node.js модули, о которых вы должны знать: socket.io
====================================================

Всем привет! Это восьмой пост в моей серии статей :doc:`index`.

Первый пост был про :doc:`dnode <dnode>` — фристайл RPC библиотеку для
node.js. Второй пост был посвящен :doc:`optimist <optimist>` — легковесному
парсеру командной строки для node.js. Третий был про :doc:`lazy <lazy>` —
ленивые списки для node.js. А четвертый — про :doc:`request <request>` —
швецарский нож HTTP стримминга. Пятый был про :doc:`hashish <hashish>` —
библиотеку для работы с хэшами. Шестой пост касался :doc:`read <read>` —
обертки для чтения со стандратного потока ввода (stdin). Седьмой был про
:doc:`ntwitter <ntwitter>` — twitter API для node.js.

В данной статье я расскажу про socket.io_. Могу поспорить, что большинство
из вас уже знакомо с **socket.io**, однако несколько людей попросили меня
написать статью про **socket.io**, что, собственно, и делаю.

.. _socket.io: https://github.com/LearnBoost/socket.io

Благодаря **socket.io** websockets и работа в реальном времени становятся
возможными во всех браузерах. Кроме того, библиотека дополняет websockets
такими фишками, как мультиплексирование, горизонтальное масштабирование и
автоматическое кодирование JSON. Автором **socket.io** является ­
`Guillermo Rauch`_, который так же является сооснователем LearnBoost_.

.. _Guillermo Rauch: http://devthought.com/
.. _LearnBoost: https://www.learnboost.com/

**Socket.io** всегда выбирает лучший из возможных методов связи реального
времени. Ниже представлен список всех методов, которые он поддерживает:

* WebSocket
* Adobe Flash Socket
* AJAX long polling
* AJAX multipart streaming
* Forever Iframe
* JSONP Polling

Так, например, при работе в Chrome **socket.io** будет использовать
websockets. А если ваш браузер не поддерживает websockets, то библиотека
попытается использовать flash sockets, а если и этот вариант не подойдет,
то long polling и так далее.

Теперь давайте рассмотрим очень простой пример использования **socket.io**:

.. code-block:: javascript

    var io = require('socket.io');
    var express = require('express');

    var app = express.createServer()
    var io = io.listen(app);

    app.listen(80);

    io.sockets.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    });

В примере с помощью потрясающего веб фреймворка express_ (о котором я скоро
напишу отдельную заметку) поднимается веб-сервер на 80-ом порту, к которому
подключается **socket.io**.

.. _express: http://expressjs.com/

После этого **socket.io** начинает ждать новых соединений. И когда создается
новое соединение из браузера, библиотека создает событие ``news``, в котором
передает хэш ``{ hello: 'world' }``, и отсылает его обратно браузеру.

Кроме этого, создаются слушатели таких событий как ``my other event`` и
``disconnect``. При создании веб-приложением события ``my other event``,
**socket.io** вызывает функцию обратного вызова ``function (data) {
console.log(data); }``, которая просто выводит данные в консоль. При
отсоединении клиента, в консоль так же пишется соответствующая запись.

Вот пример клиента (то, что в браузере):

.. code-block:: html

    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io.connect('http://localhost');
      socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
      });
    </script>

В первую очередь, подключается скрипт ``socket.io.js``. После этого создается
соединение с ``http://localhost``. В этот момент **socket.io** выбирает
наилучший способ соединения, поддерживаемый браузером. Далее создается
слушатель сообщения ``news``, который при наступлении данного собития
генерирует событие ``my other event``.

Таким образом вы можете создавать различного рода приложения реального
времени. Например, `чат-сервер`_ или `irc-клиент`_.

.. _чат-сервер: https://github.com/LearnBoost/socket.io/tree/master/examples/chat
.. _irc-клиент: https://github.com/LearnBoost/socket.io/tree/master/examples/irc-output

В библиотеке полно других фишек, таких как пространства имен, кратковременные
сообщения, подтверждение сообщений и броадкастинг сообщений. Чтобы по-больше
узнать обо всех этих ништяках — изучайте `документацию`_.

.. _документацию: https://github.com/LearnBoost/socket.io

Для установки **socket.io** достаточно выполнить::

    npm install socket.io

Так же обратите внимание на :doc:`dnode <dnode>`, которая позволяет вызывать
функции через socket.io.

Наслаждайтесь!
