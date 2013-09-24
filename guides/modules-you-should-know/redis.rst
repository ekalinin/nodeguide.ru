================================================
Node.js модули, о которых вы должны знать: redis
================================================

Всем здравствуйте! Это девятый пост в моей серии статей :doc:`index`.

Первый пост был про :doc:`dnode <dnode>` — фристайл RPC библиотеку для
node.js. Второй пост был посвящен :doc:`optimist <optimist>` — легковесному
парсеру командной строки для node.js. Третий был про :doc:`lazy <lazy>` —
ленивые списки для node.js. А четвертый — про :doc:`request <request>` —
швецарский нож HTTP стримминга. Пятый был про :doc:`hashish <hashish>` —
библиотеку для работы с хэшами. Шестой пост касался :doc:`read <read>` —
обертки для чтения со стандратного потока ввода (stdin). Седьмой был про
:doc:`ntwitter <ntwitter>` — twitter API для node.js. Восьмой пост был
посвящён :doc:`socket.io <socketio>`, который делает возможным websockets
во всех браузерах.

Сегодня я хочу вам представить node_redis_ — лучшую клиентскую API библиотеку
для Redis. Автором библиотеки является `Matt Ranney`_.

.. _node_redis: https://github.com/mranney/node_redis
.. _Matt Ranney: http://ranney.com/

Эта библиотека — полноценный Redis клиент для node.js. Она поддерживает все
комманды Redis, включая даже те, что были добавлены совсем недавно (например,
``EVAL`` из экспериментальной ветки).

Вот пример использования:

.. code-block:: javascript

    var redis = require("redis");
    var client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });

А вот результат работы примера::

    $ node example.js
    Reply: OK
    Reply: 0
    Reply: 0
    2 replies:
        0: hashtest 1
        1: hashtest 2

Каждая Redis комманда представляет из себя функцию объекта ``client``. Все
функции принимают в качестве аргументов либо массив ``args`` и необязательную
функцию ``callback``, либо произвольное число аргументов, последним из которых
является необязательная функция обратного вызова (callback).

Вот пример передачи массива и callback'a:

.. code-block:: javascript

    client.mset(["key 1", "val 1"], function (err, res) {});

А вот тот же пример, но во втором стиле:

.. code-block:: javascript

   client.mset("key 1", "val 1", function (err, res) {});

Обратите внимание, что в обоих случаях callback — не обязателен:

.. code-block:: javascript

    client.set("some key", "some val");
    client.set(["some other key", "some val"]);

Полный список комманд, поддерживаемых Redis, перечислен в
`Redis Command Reference`_.

.. _Redis Command Reference: http://redis.io/commands

Команды могут быть указаны, как в верхнем, так и в нижнем регистре:
``client.get()`` тоже самое, что и ``client.GET()``.

**Redis** можно тривиально установить через npm::

    npm install redis

PS: `Pieter Noordhuis`_ сделал биндинги к оффициальной ``C``-библиотеке
``hiredis``, которая написана в неблокирующем стиле и достаточно быстра.
Она называется `hiredis-node`_. Чтобы установить **hiredis**, необходимо
выполнить::

    npm install hiredis redis

.. _Pieter Noordhuis: https://github.com/pietern
.. _hiredis-node: https://github.com/pietern/hiredis-node

Если установлена **hiredis**, то **node_redis** будет использовать её «по
умолчанию». В противном случае, будет использовать парсер, реализованный
на чистом JavaScript.
