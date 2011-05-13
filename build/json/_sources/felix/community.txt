============================================
Руководство по сообществу Node.js от Felix'a
============================================

Если вы только что прочитали :doc:`Руководство для начинающих <beginner>`
и задумались об участии в сообществе node.js, то это руководство для вас.

IRC
===

`IRC <http://ru.wikipedia.org/wiki/IRC>`_ замечательно подходит не только
для холивара на тему `vim против emacs`, но и для общения и консультаций
с участниками node.js сообщества.

Официальный irc-канал для node.js находится на `chat.freenode.net
<http://webchat.freenode.net/>`_ и называется `#node.js` (да, точка -
часть имени). Обычно там присутствует около 500 человек.

Если у Вас есть вопрос, не стесняйтесь - спрашивайте. В зависимости от
того, кто не спит, Вы с большой долей вероятности получите быстрый и
точный ответ. В противном случае просто подождите около часа и в случае,
если Ваш вопрос все еще без ответа, заадвайте свой вопрос снова.

И еще - всегда перед тем как задать вопрос постарайтесь поискать ответ
на него в интернете. Ну вы `знаете <http://lmgtfy.com/>`_, да?

Google Groups
=============

Множество обсуждений про node.js происходят через рассылки google групп.
Существует две рассылки:

`nodejs <https://groups.google.com/forum/#!forum/nodejs>`_
    Рассылка `nodejs` предназначена для основных вопросов и дискуссий о
    node.js То есть, это, скорее всего, именно та рассылка, которая Вам
    понадобится.

`nodejs-dev <https://groups.google.com/forum/#!forum/nodejs-dev>`_
    Рассылка `nodejs-dev` предназначена для случаев, когда Вы нашли ошибку
    в node.js или хотите обсудить какую-либо фичу node.js или процесс
    разработки. Эта рассылка не такая шумная, как `nodejs`, но большинство
    разработчиков ядра node.js участвуют в ней.

Twitter
=======

В силу того, что twitter обрезает имена тэгов после точки, большинство
пользователей, чтобы выделить содержимое, относящееся к node.js, стали
использовать тэг `#nodejs`. Чтобы найти твиты, относящиеся к node.js,
можно воспользоваться следующим поиском:

`http://search.twitter.com/search?q=#nodejs OR node.js
<http://search.twitter.com/search?q=%23nodejs%20OR%20node.js>`_

В силу того, что не все пользователи помечают тэгами свой контент, выше
указанный поиск так же включает в себя результаты для фразы `node.js`.

Основные участники
==================

Если Вас интересуют люди, управляющие разработкой и экосистемой node.js, то
далее будет список тех, чьи имена Вы должны знать.

Ryan Dahl
---------

Райан - автор, основной сопровождающий и `ВПД`_ проекта node.js. Это
означает, что любой коммит в исходный код node.js проверяется им.
Так же это означает, что Райан - единственный, кто проталкивает
изменения в репозиторий node.js.

Несмотря на то, что Райан в большинстве случаев пытается отвечать на
вопросы в списках рассылок и IRC, он очень занятой парень. Так что не
следует расстраиваться, если он не сразу отвечает на Ваши вопросы.
Обычно есть еще люди, которые так же могут Вам помочь.

Райан в настоящее время работает на Joyent_. Эта компания разрабатывает
и поддерживает heroku-подобный `node.js хостинг`_ и является официальным
корпоративным спонсором node.js.

.. _ВПД: http://ru.wikipedia.org/wiki/Великодушный_пожизненный_диктатор
.. _Joyent: http://joyent.com/
.. _node.js хостинг: http://no.de/

* IRC Nick: ryah
* Twitter: `@ryah <http://twitter.com/ryah>`_
* GitHub: `ry <https://github.com/ry>`_
* Блог: `blog.nodejs.org <http://blog.nodejs.org/>`_
* Откуда: San Francisco, USA

Isaac Schlueter
---------------

Исак - автор пакетного менеджера для node.js - npm_, которым пользуется
сообщество node.js. Он так же работает на Joyent_ и вносит значительный
вклад в разработку ядра node.js. В свое свободное время он пытается
освободить JavaScript сообщество от `рабства точки с запятой`_.

* IRC Nick: isaacs
* Twitter: `@izs <http://twitter.com/izs>`_
* GitHub: `isaacs <https://github.com/isaacs>`_
* Блог: `blog.izs.me <http://blog.izs.me/>`_
* Откуда: San Francisco, USA

.. _npm: http://npmjs.org/
.. _рабства точки с запятой: http://blog.izs.me/post/3393190720/how-this-works

Bert Belder
-----------

Берт - основной разработчик, занимающийся проблемой портирования node.js
под Windows. Так же он является одним из самых значительных участников
проекта.

* IRC Nick: piscisaureus
* Twitter: `@piscisaureus <http://twitter.com/piscisaureus>`_
* GitHub: `piscisaureus <https://github.com/piscisaureus>`_
* Откуда: Netherlands

TJ Holowaychuk
--------------

TJ - автор express_, jade_ и многих других популярных библиотек node.js.

* Twitter: `@tjholowaychuk <http://twitter.com/tjholowaychuk>`_
* GitHub: `visionmedia <https://github.com/visionmedia>`_
* Блог: `tjholowaychuk.com <http://tjholowaychuk.com/>`_
* Откуда: Victoria, BC, Canada

.. _express: http://expressjs.com/
.. _jade: http://jade-lang.com/

Tim Caswell
-----------

Тим - автор connect_, кроме того, он поддерживал проект node.js с самого
начала. В настоящий момент он работает в HP (Palm) и известен благодаря
блогу `howtonode.org`_, который предоставляем возможность писать сразу
нескольким авторам.

* IRC Nick: creationix
* Twitter: `@creationix <http://twitter.com/creationix>`_
* GitHub: `creationix <https://github.com/creationix>`_
* Блог: `howtonode.org`_
* Откуда: San Francisco, USA

.. _connect: https://github.com/senchalabs/connect
.. _howtonode.org: http://howtonode.org/

Felix Geisendörfer
------------------

Искренне Ваш, я активно занимаюсь разработкой ядра node.js, а так же
работаю над такими проектами, как formidable_, mysql_ и данным руководством.
Помимо разработки ядра, я так же являюсь со-основателем node.js стартапа,
предоставляющего сервис по загрузке файлов и кодированию видео -
`transloadit.com`_.

* IRC Nick: felixge
* Twitter: `@felixge <http://twitter.com/felixge>`_
* GitHub: `felixge <https://github.com/felixge>`_
* Блог: `debuggable.com/blog <http://debuggable.com/blog>`_
* Откуда: Berlin, Germany

.. _formidable: https://github.com/felixge/node-formidable
.. _mysql: https://github.com/felixge/node-mysql
.. _transloadit.com: http://transloadit.com/

Mikeal Rogers
-------------

Михал - автор request_, а так же активный участник сообщества и
разработчик node.js.

* IRC Nick: mikeal
* Twitter: `@mikeal <http://twitter.com/mikeal>`_
* GitHub: `mikeal <https://github.com/mikeal>`_
* Блог: `mikealrogers.com <http://www.mikealrogers.com/>`_
* Откуда: San Francisco, USA

.. _request: https://github.com/mikeal/request

Alexis Sellier
--------------

Алексис - гуру JavaScript, отвечающий за такие проекты, как less.js_,
vows_ и многих других.

* IRC Nick: cloudhead
* Twitter: `@cloudhead <http://twitter.com/cloudhead>`_
* GitHub: `cloudhead <https://github.com/cloudhead>`_
* Блог: `cloudhead.io <http://cloudhead.io/>`_
* Откуда: Montreal, QC, Canada

.. _less.js: http://lesscss.org/
.. _vows: http://vowsjs.org/

Jeremy Ashkenas
---------------

Джереми - автор таких проектов, как CoffeeScript_, underscore_,
backbone_, docco_ и многих других популярных node.js / JavaScript
библиотек. Он так же занимается стартапом DocumentCloud_.

* IRC Nick: jashkenas
* Twitter: `@jashkenas <http://twitter.com/jashkenas>`_
* GitHub: `jashkenas <https://github.com/jashkenas>`_, `DocumentCloud-github <https://github.com/documentcloud>`_
* Откуда: New York City, USA

.. _CoffeeScript: https://github.com/jashkenas/coffee-script
.. _underscore: https://github.com/documentcloud/underscore
.. _backbone: https://github.com/documentcloud/backbone
.. _docco: https://github.com/jashkenas/docco
.. _DocumentCloud: http://www.documentcloud.org/

Jed Schmidt
-----------

Джед - японский переводчик, который светится как JavaScript ниндзя. Его
фреймворк для node.js, fab.js_, предлагает радикально иной подход к
структурированию JavaScript кода, и включает в себя множество удивительных
выражений, которые впечатлают большинство людей, понимающих JavaScript.

* IRC Nick: jedschmidt
* Twitter: `@jedschmidt <http://twitter.com/jedschmidt>`_
* GitHub: `jed <https://github.com/jed>`_
* Блог: `jedschmidt.com <http://jedschmidt.com/>`_
* Откуда: Tokyo, Japan

.. _fab.js: http://fabjs.org/

Marak Squires
-------------

Марак, скрывающийся под псевдонимом Jim Bastard, наиболее известен благодаря
тому, что выдает массу библиотек для node.js каждый месяц. Но еще больше он
паражает своим искусным владением ненормативной лексики и троллинга. Не
расстраивайтесь, если он заставит Вас понервничать - он хороший парень.

* IRC Nick: jimbastard
* Twitter: `@maraksquires <http://twitter.com/maraksquires>`_
* GitHub: `marak <https://github.com/marak>`_
* Блог: `blog.nodejitsu.com <http://blog.nodejitsu.com/>`_
* Откуда: New York City, USA

Peteris Krumins
---------------

Некоторые из Вас могут знать Петерисa из его популярного блога catomat.net_.
Вместе с James Halliday он недавно запустил node.js стартап - browserling_,
который в результате, помимо всего прочего, дал массу модулей с открытыми
исходными кодами от их обоих.

* IRC Nick: pkrumins
* Twitter: `@pkrumins <http://twitter.com/pkrumins>`_
* GitHub: `pkrumins <https://github.com/pkrumins>`_
* Блог: catomat.net_
* Откуда:  Riga, Latvia

.. _catomat.net: http://catonmat.net/
.. _browserling: http://browserling.com/

James Halliday
--------------

Джеймс - автор многих популярных библиотек для node.js: например, dnode_,
optimist_ и browserify_. Его так же знают за создание прикольных роботов для
browserling_, который он запустил вместе с Peteris Krumins.

* IRC Nick: substack
* Twitter: `@substack <http://twitter.com/substack>`_
* GitHub: `substack <https://github.com/substack>`_
* Блог: `substack.net <http://substack.net/>`_
* Откуда: Oakland, California, USA

.. _dnode: https://github.com/substack/dnode
.. _optimist: https://github.com/substack/node-optimist
.. _browserify: https://github.com/substack/node-browserify

Тут могло быть Ваше имя
-----------------------

Этот список не является исчерпывающим и составлен, в основном, в
случайном порядке. Моя цель - сохранить его достаточно коротким,
чтобы он не стал в результате списком всех `node.js пользователей`_,
но, вероятно, есть важные имена, которые я забыл. Так что, если Вы
хотите увидеть своё имя здесь, просто напишите мне на email.

.. _node.js пользователей: https://github.com/joyent/node/wiki/Node-Users
