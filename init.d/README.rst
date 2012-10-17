Автостарт через init.d
======================

Чтобы приложение автоматически стартовало при загрузке OS необходимо
сделать следующее::

    $ sudo cp ./init.d/nodeguide_ru /etc/init.d/
    $ sudo chmod a+x /etc/init.d/nodeguide_ru
    $ sudo update-rc.d -f nodeguide_ru defaults
