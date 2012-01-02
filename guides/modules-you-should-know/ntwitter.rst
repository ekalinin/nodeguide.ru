===================================================
Node.js модули, о которых вы должны знать: ntwitter
===================================================

Всем здрасьте! Это седьмой пост в моей новой серии статей :doc:`index`.

Первый пост был про :doc:`dnode <dnode>` — фристайл RPC библиотеку для
node.js. Второй пост был посвящен :doc:`optimist <optimist>` — легковесному
парсеру командной строки для node.js. Третий был про :doc:`lazy <lazy>` —
ленивые списки для node.js. А четвертый — про :doc:`request <request>` —
швецарский нож HTTP стримминга. Пятый был про :doc:`hashish <hashish>` —
библиотеку для работы с хэшами. Шестой пост касался :doc:`read <read>` —
обертки для чтения со стандратного потока ввода (stdin).

В этот раз я хочу вам представить ntwitter_ — асинхронный Twitter REST,
потоковый и поисковый клиентский API. Данный модуль поддерживает­
`Charlie McConnell, aka AvianFlu`_. Первоначальным автором **ntwitter**
был technoweenie_, но с тех пор сопровождающие менялись несколько раз.

.. _ntwitter: https://github.com/AvianFlu/ntwitter
.. _Charlie McConnell, aka AvianFlu: https://github.com/AvianFlu
.. _technoweenie: https://github.com/technoweenie

Для того, чтобы воспользоваться модулем, необходимо получить API ключи.
Сделать это можно на `dev.twitter.com`_. Просто зарегистрируйте новое
приложение и ключи — ваши.

.. _dev.twitter.com: http://dev.twitter.com/

Вот пример приложения **ntwitter**, которое твитит:

.. code-block:: javascript

    var twitter = require('ntwitter');

    var twit = new twitter({
      consumer_key: 'Twitter',
      consumer_secret: 'API',
      access_token_key: 'keys',
      access_token_secret: 'go here'
    });

    twit
      .verifyCredentials(function (err, data) {
        if (err) {
          console.log("Error verifying credentials: " + err);
          process.exit(1);
        }
      })
      .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
        function (err, data) {
          if (err) console.log('Tweeting failed: ' + err);
          else console.log('Success!')
        }
      );

А вот как выполнять поиск через **ntwitter** API:

.. code-block:: javascript

    var twitter = require('ntwitter');

    var twit = new twitter({
      consumer_key: 'Twitter',
      consumer_secret: 'API',
      access_token_key: 'keys',
      access_token_secret: 'go here'
    });

    twit.search('nodejs OR #node', function(err, data) {
      if (err) {
        console.log('Twitter search failed!');
      }
      else {
        console.log('Search results:');
        console.dir(data);
      }
    });

Кроме того, вот так можно использовать потоковое API Twitter'a:

.. code-block:: javascript

    var twitter = require('ntwitter');

    var twit = new twitter({
      consumer_key: 'Twitter',
      consumer_secret: 'API',
      access_token_key: 'keys',
      access_token_secret: 'go here'
    });

    twit.stream('statuses/sample', function(stream) {
      stream.on('data', function (data) {
        console.log(data);
      });
    });

`Тут`_ перечислены все варианты для ``statuses/*``, которые вы
можете использовать.

Обратите внимание, что вам не обязательно логиниться в twitter,
чтобы выполнять поиск или стриминг.

.. _Тут: https://dev.twitter.com/docs/streaming-api/methods

Вот как можно стримить чьи-то твиты:

.. code-block:: javascript

    var twitter = require('ntwitter');

    var twit = new twitter({
      consumer_key: 'Twitter',
      consumer_secret: 'API',
      access_token_key: 'keys',
      access_token_secret: 'go here'
    });

    twit.stream('user', {track:'nodejs'}, function(stream) {
      stream.on('data', function (data) {
        console.dir(data);
      });
      stream.on('end', function (response) {
        // Обработка разъединения
      });
      stream.on('destroy', function (response) {
        // Обработка 'тихого' разъединения от твиттера
      });
    });

И наконец, можно стримить твиты из конкретного местоположения, определенного
некоторыми границами:

.. code-block:: javascript

    var twitter = require('ntwitter');

    var twit = new twitter({
      consumer_key: 'Twitter',
      consumer_secret: 'API',
      access_token_key: 'keys',
      access_token_secret: 'go here'
    });

    twit.stream('statuses/filter',
        {'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'},

        function(stream) {
          stream.on('data', function (data) {
            console.log(data);
          });
        }
    );

Чтобы получить географические координаты границ региона, можно воспользоваться
модулем `node-finden`_ от `Cole Gillespie`_

.. _node-finden: https://github.com/coleGillespie/node-finden
.. _Cole Gillespie: http://twitter.com/#!/theCole

Вот и всё. С **ntwitter** можно легко делать практически всё, что нужно для
twitter.

С помощью npm можно легко установить **ntwitter**::

    npm install ntwitter

Наслаждайтесь!
