================================================
Node.js модули, о которых вы должны знать: dnode
================================================

Всем привет! Я начинаю новую серию статей под названием :doc:`index`. Я
использую node.js более двух лет, а так же я я являюсь автором стартапа
Browserling_, который использует node.js. Так что, я знаю про node.js
практически всё. Кроме того, я являюсь автором более 20 модулей для node.js
(мой `профиль на GitHub`_)

.. _Browserling: http://www.catonmat.net/blog/launching-browserling/
.. _профиль на GitHub: https://github.com/pkrumins

В этой серии я опишу несколько дюжин модулей node.js, дам примеры их
использования и объясню, где эти модули лучше всего использовать.

Первым модулем в серии будет dnode_. **dnode** — это библиотека для создания RPC
(**freestyle rpc**). Автор — :ref:`James Halliday <james-halliday>`, являющийся
сооснователем Browserling_ и Testling_.

.. _dnode: http://github.com/substack/dnode
.. _Testling: http://www.catonmat.net/blog/announcing-testling/

Вот, что **dnode** из себя представляет. Это ``server.js``:

.. code-block:: javascript

    var dnode = require('dnode');

    var server = dnode({
        mul : function (n, m, cb) { cb(n * m) }
    });
    server.listen(5050);

А вот ``client.js``:

.. code-block:: javascript

    var dnode = require('dnode');

    dnode.connect(5050, function (remote) {
        remote.mul(10, 20, function (n) {
            console.log('10 * 20 = ' + n);
        });
    });

Теперь, если запустить ``client.js``, то будет следующее::

    $ node client.js
    200

Итак, что оно делает? Происходит вызов функции ``mul`` на серверной стороне
со стороны клиента. При этом передаются аргументы ``10`` и ``20``. Переданные
аргументы перемножаются на серверной стороне, после чего результат отсылается
на клиента с помощью вызова функции ``cb``.

Обратите внимание, что **никакого кода не передается между клиентом и сервером**
Всё происходит с использованием ссылок. Посмотреть на реализацию dnode-протокола
вы можете в репозитарии `dnode-protocol github`_.

.. _dnode-protocol github: https://github.com/substack/dnode-protocol

Теперь давайте посмотрим на более сложный пример, где клиент вызывает сервер,
который в свою очередь вызывает клиента, который передает результат обратно на
сервер, который вызывает клиента и печатает результат.

``server.js``:

.. code-block:: javascript

    var dnode = require('dnode');

    var server = dnode(function (client) {
        this.calculate = function (n, m, cb) {
            client.div(n*m, function (res) {
                cb(res+1)
            });
        }
    });
    server.listen(5050);

``client.js``:

.. code-block:: javascript

    var dnode = require('dnode');

    var client = dnode({
        div : function (n, cb) {
           cb(n/5);
        }
    });

    client.connect(5050, function (remote) {
        remote.calculate(10, 20, function (n) {
            console.log('the result is ' + n);
        });
    });


Если запустить ``client.js``, то будет получен результат: ``41``. Вот как это
происходит. Сначала вы подключаетесь к dnode-серверу на ``5050`` порту. После
того, как соединение установлено, dnode-клиент вызывает функцию ``calculate``
на стороне сервера, в которую передаёт аргументы ``10`` и ``20``, а так же
функцию обратного вызова (callback), которая выводит на экран результат. После
того, как сервер получил аргументы ``10`` и ``20``, он их перемножает и
вызывает функцию ``div`` со стороны клиента, которая делит полученный аргумент
на ``5``. Результат возвращается на сервер (через функцию обратного вызова),
который прибавляет ``1`` к полученному результату и вызывает первоначальную
функцию обратного вызова, которая печатает результат.

Мы повсеместно используем **dnode** в Browserling_. Каждый сервис — это
dnode-сервер. Все сервисы связаны друг с другом. Например, аутентификация —
это dnode-сервер. Мы можем легко его оставить и обновить, в то время, как
остальная часть сайта исправно работает. Просто супер!

Установить **dnode** можно с помощью npm::

    npm install dnode

В силу того, что dnode имеет четко описанный протокол, вы можете его реализовать
на любом языке программирования! Так, уже есть реализации на Perl_, Ruby_, PHP_,
Java_.

.. _Perl: https://github.com/substack/dnode-perl
.. _Ruby: https://github.com/substack/dnode-ruby
.. _PHP: https://github.com/bergie/dnode-php
.. _Java: https://github.com/aslakhellesoy/dnode-java

Наслаждайтесь этой рэпующей черепашкой!

.. image:: ../../public/img/dnode-freestyle-rpc.jpg
   :align: center
   :alt: Модули node.js, о которых вы должны знать: dnode. Рэпующая черепашка.
