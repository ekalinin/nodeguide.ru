===============================================
Node.js модули, о которых вы должны знать: read
===============================================

Всем привет! Это шестой пост в моей новой серии статей :doc:`index`.

Первый пост был про :doc:`dnode <dnode>` — фристайл RPC библиотеку для
node.js. Второй пост был посвящен :doc:`optimist <optimist>` — легковесному
парсеру командной строки для node.js. Третий был про :doc:`lazy <lazy>` —
ленивые списки для node.js. А четвертый — про :doc:`request <request>` —
швецарский нож HTTP стримминга. Пятый был про :doc:`hashish <hashish>` —
библиотеку для работы с хэшами.

В этой заметке я расскажу про новый (по состоянию на 08-дек-2011, прим.
перевод.) модуль — read_, который был создан буквально вчера. Автор —
:ref:`Isaac Z. Schlueter <community-isaac-schlueter>`, который так же
является автором npm_. По сути, **read** — это `read(1)`_ для node.js.
С его помощью вы легко сможете читать стандартный поток ввода (stdin).

.. _read: https://github.com/isaacs/read
.. _Isaac Z. Schlueter: http://blog.izs.me/
.. _npm: http://npmjs.org/
.. _read(1): http://linux.die.net/man/1/read

Пример использования:

.. code-block:: javascript

    var read = require('read');

    read({ prompt : 'Username: ' }, function (err, user) {
      read({ prompt : 'Password: ', silent : true }, function (err, pass) {
        console.log(user, pass);
        process.stdin.destroy();
      });
    })

Такая вложенность функций — это, конечно, «не айс». Так что, лучше
воспользоваться, например, seq_, библиотекой асинхронного контроля потока
событий, автором которой является уже не безызвестный
:ref:`James Halliday <james-halliday>`. Немного позже я так же расскажу
про этот модуль. Вот как будет выглядеть тот же пример с seq:

.. _seq: https://github.com/substack/node-seq

.. code-block:: javascript

    var read = require('read');
    var Seq = require('seq');

    Seq()
      .seq(function () {
        read({ prompt : 'Username: ' }, this.into('user'));
      })
      .seq(function () {
        read({ prompt : 'Password: ', silent : true }, this.into('pass'));
      })
      .seq(function (pass) {
        console.log(this.vars.user, this.vars.pass);
      });

Вот все настройки, которые поддерживает **read**::

    prompt  - Что вывести на экран (stdout) перед чтением ввода (stdin).
    silent  - Не отображать ввод пользователя при наборе.
    num     - Максимальное число символов, которое необходимо прочитать.
    delim   - Символ, обозначающий конец ввода. По умолчанию: "\n".
    timeout - Время ожидания ввода пользователя в мс.

Обратите внимание, что если ``silent`` == ``true`` или задан ``num``, или
для ``delim`` задано что-то, отличное от ``"\n"``, то чтение будет происходить
по-символьно.

Установить **read** можно через npm::

    npm install read

Наслаждайтесь!
