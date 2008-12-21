#!/usr/bin/env seed
Seed.import_namespace("Gtk");
Seed.import_namespace("Multiprocessing");
Seed.import_namespace("Gio");

var pipes = new Multiprocessing.Pipe();

var child_pid = Seed.fork();

if (child_pid == 0)
{
	Gtk.init(null, null);
	
	var pipe = pipes[0];

	var id = parseInt(pipe.read());

	var l = new Gtk.Label({label: "Hello GtkPlug World"});
	var s = Gtk.Plug._new(id);
	
	s.add(l);
	s.show_all();
	Gtk.main();
}

Gtk.init(null, null);
var w = new Gtk.Window();
var s = new Gtk.Socket();
var pipe = pipes[1];

w.add(s);
w.show_all();

pipe.write(s.get_id());

Gtk.main();
