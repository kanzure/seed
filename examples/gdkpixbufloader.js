#!/usr/local/bin/seed
Seed.import_namespace("GLib");
Seed.import_namespace("Gio");
Seed.import_namespace("GdkPixbuf");
Seed.import_namespace("Gtk");

var blue_marble = 
	Gio.file_new_for_uri("http://veimages.gsfc.nasa.gov/7100/world.topo.bathy.200401.3x5400x2700.jpg");

blue_marble.read_async(0, null, function(source, result)
					   {
						   var loader = new GdkPixbuf.PixbufLoader();
						   var stream = source.read_finish(result);
						   var dstream = new Gio.DataInputStream.c_new(stream);

						   try
						   {
							   while (1)
							   {
								   loader.write([dstream.read_byte()], 1);
							   }
						   }
						   catch (e)
						   {
						   }
						   
						   var pixbuf = loader.get_pixbuf();
						   pixbuf.savev("bluemarble","jpeg");
					   });

var loop = GLib.main_loop_new();
GLib.main_loop_run(loop);

