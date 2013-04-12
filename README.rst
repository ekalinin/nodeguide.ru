Что это
=======

Это исходный код, отвечающий за работу сайта http://nodeguide.ru.

Как это работает
================

Внутри работают два фреймворка:

* sphinx.pocoo.org_ (обертка над reStructuredText_)
* express_ (веб фреймворк для node.js_)

.. _sphinx.pocoo.org: http://sphinx.pocoo.org/
.. _express: http://expressjs.com
.. _node.js: http://nodejs.org/
.. _reStructuredText: http://docutils.sf.net/rst.html

Первый отвечает за трансляцию исходных текстов из \*.rst в \*.json.
Второй — за отображение json в HMTML.

Локальный запуск
================

Для того, чтобы заставить работать этот код на локальной машине
необходимо выполнить описанные ниже манипуляции. Все действия
рассчитаны на то, что будут выполняться в ОС типа Ubuntu/Debian.

Чтобы не засорять систему пакетами, которые, возможно больше
нигде и не понадобятся, а так же для случаев, если нет прав root,
вся установка будет выполняться в изолированных виртуальных
окружениях (отдельно для python, отдельно для node.js).

Чтобы иметь возможность собрать node.js необходимо установить
следующие пакеты::

    $ sudo aptitude install build-essential libssl-dev

Чтобы иметь возможность создавать изолированные окружения,
необходимо установить следующие пакеты::

    $ sudo aptitude install curl python-virtualenv

Создаем виртуальное окружение для python и активируем его::

    $ virtualenv --no-site-packages ./env
    $ . ./env/bin/activate

Устанавливаем пакеты в python-окружении. sphinx_ — для генерации
\*.json, nodeenv_ — для создания виртуального окружения для node.js::

    (env) $ pip install nodeenv sphinx

.. _sphinx: http://sphinx.pocoo.org/
.. _nodeenv: http://github.com/ekalinin/nodeenv

Создаем виртуальное окружение для node.js, попутно устанавливая все
необходимые пакеты для node.js, и активируем новое окружение::

    (env) $ nodeenv --node=0.4.12 --npm=1.0.106 -p
    (env) $ npm install

Генерируем \*.json и запускаем сайт на http://127.0.0.1:3000::

    (env) $ make dev
