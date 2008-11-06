#!/usr/local/bin/seed

Seed.import_namespace("Gtk");
Gtk.init(null, null);

var window = new Gtk.Window({title: "Browser"});

function quit()
{
    Gtk.main_quit();
}

window.signal.hide.connect(quit);

function create_ui()
{
    var main_ui = new Gtk.VBox();
    var toolbar = new Gtk.HBox();

    var back_button = new Gtk.ToolButton({stock_id: "gtk-go-back"});
    var forward_button = new Gtk.ToolButton({stock_id: "gtk-go-forward"});
    var refresh_button = new Gtk.ToolButton({stock_id: "gtk-refresh"});

    var url_entry = new Gtk.Entry();

    back_button.signal.clicked.connect(back);
    forward_button.signal.clicked.connect(forward);
    refresh_button.signal.clicked.connect(refresh);

    url_entry.signal.activate.connect(browse);

    toolbar.pack_start(back_button);
    toolbar.pack_start(forward_button);
    toolbar.pack_start(refresh_button);
    toolbar.pack_start(url_entry, true, true);

    main_ui.pack_start(toolbar);
    return main_ui;
}

function forward(button)
{
    Seed.print("forward");
}

function back(button)
{
    Seed.print("back");
}

function refresh(button)
{
    Seed.print("refresh");
}

function browse(button)
{
    Seed.print("browser");
}

window.add(create_ui());
window.show_all();

Gtk.main();
