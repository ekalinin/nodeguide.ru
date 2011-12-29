===================================================
Node.js модули, о которых вы должны знать: optimist
===================================================

Всем привет! Это второй пост в моей новой серии статей :doc:`index`.

Первый пост был про :doc:`dnode <dnode>` — фристайл RPC библиотеку для node.js.

На этот раз я представляю node-optimist_ — легковесную библиотеку для
парсинга опций в командной строке. Автором является мой партнер (сооснователь)
по Browserling_ и Testling_ — :ref:`James Halliday <james-halliday>`.

.. _node-optimist: https://github.com/substack/node-optimist
.. _Browserling: http://www.catonmat.net/blog/launching-browserling/
.. _Testling: http://www.catonmat.net/blog/announcing-testling/

Интересно, насколько лёгкий может быть разбор аргументов коммандной строки?
Оцените:

.. code-block:: javascript

    var argv = require('optimist').argv;

И всё! Все опции проанализированы и помещены в ``argv``.

Длинные аргументы
=================

Вот еще несколько примеров использования. Самое главное то, что библиотека
поддерживает длинные аргументы:

.. code-block:: javascript

    var argv = require('optimist').argv;

    if (argv.rif - 5 * argv.xup > 7.138) {
        console.log('Buy more riffiwobbles');
    }
    else {
        console.log('Sell the xupptumblers');
    }

Данный скрипт вы можете запустить с аргументами ``--rif`` и ``--xup``:

.. code-block:: bash

    $ node ./xup.js --rif=55 --xup=9.52
    Buy more riffiwobbles

    $ node ./xup.js --rif 12 --xup 8.1
    Sell the xupptumblers

Короткие аргументы
==================

Кроме этого, библиотека поддерживает короткие аргументы:

.. code-block:: javascript

   var argv = require('optimist').argv;
   console.log('(%d,%d)', argv.x, argv.y);

Теперь вы можете использовать аргументы ``-x``, ``-y``:

.. code-block:: bash

   $ node ./short.js -x 10 -y 21
   (10,21)

Логические аргументы
====================

**Node-optimist** так же поддерживает логические аргументы всех типов:
короткие, длинные и сгруппированные:

.. code-block:: javascript

    var argv = require('optimist').argv;

    if (argv.s) {
        console.log(argv.fr ? 'Le chat dit: ' : 'The cat says: ');
    }
    console.log(
        (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
    );

Данный скрипт можеь быть вызван с различными аргументами:

.. code-block:: bash

    $ node ./bool.js -s
    The cat says: meow

    $ node ./bool.js -sp
    The cat says: meow.

    $ node ./bool.js -sp --fr
    Le chat dit: miaou.

«Без-дефисные» аргументы
========================

«Без-дефисные» аргументы легко получить через ``argv._``:

.. code-block:: javascript

    var argv = require('optimist').argv;

    console.log('(%d,%d)', argv.x, argv.y);
    console.log(argv._);

Пример использования:

.. code-block:: bash

    $ node ./nonopt.js -x 6.82 -y 3.35 moo
    (6.82,3.35)
    [ 'moo' ]

    $ node ./nonopt.js foo -x 0.54 bar -y 1.12 baz
    (0.54,1.12)
    [ 'foo', 'bar', 'baz' ]

Описание и обязательные аргументы
=================================

**Optimist** поставляется с двумя функциями ``.usage()`` и ``.demand()``:

.. code-block:: javascript

    var argv = require('optimist')
        .usage('Usage: $0 -x [num] -y [num]')
        .demand(['x','y'])
        .argv;

    console.log(argv.x / argv.y);

Аргументы ``x`` и ``y`` являются обязательными. Если они не указаны, то будет
автоматически выведено на экран описание использования:

.. code-block:: bash

    $ node ./divide.js -x 55 -y 11
    5

    $ node ./divide.js -x 4.91 -z 2.51
    Usage: node ./divide.js -x [num] -y [num]

    Options:
      -x  [required]
      -y  [required]

    Missing required arguments: y

Значения «по умолчанию»
=======================

**Optimist** так же поддерживает значения «по умолчанию» с помощью функции
``.default()``:

.. code-block:: javascript

    var argv = require('optimist')
        .default('x', 10)
        .default('y', 10)
        .argv;

    console.log(argv.x + argv.y);

Теперь ``x`` и ``y`` будут принимать значение ``10``, если их не указать явно:

.. code-block:: bash

    $ node ./default_singles.js -x 5
    15

Наслаждайтесь этим незнакомцем:

.. image:: ../../public/img/node-optimist.png
   :align: center
   :alt: Модули node.js, о которых вы должны знать: node-optimist.


Альтернативы
============

В качестве альтернативы вы можете использовать nopt_ от  isaacs_, который
позволяет контролировать типы данных для аргументов и может использоваться
для разбора большого количества аргументов. Еще одной альтернативой может
стать модуль nomnom_, который позволяет описывать аргументы в виде хэшей.

.. note::
   Еще одной альтернативой является библиотека commander.js_. (прим. переводчика)

.. _nopt: https://github.com/isaacs/nopt
.. _isaacs: https://github.com/isaacs
.. _nomnom: https://github.com/harthur/nomnom
.. _commander.js: https://github.com/visionmedia/commander.js
