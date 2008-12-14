#!/usr/bin/env seed
Seed.import_namespace("Gtk","2.0");
Seed.import_namespace("Gst","0.10");

Gst.init(null, null);
Gtk.init(null, null);

// This is a really ugly program.

function oscillator(freq)
{
	this.vbox = new Gtk.VBox();
	this.hbox = new Gtk.HBox();
	this.vscale = new Gtk.VScale();
	this.volscale = new Gtk.VScale();
	this.button = new Gtk.Button({label: "Toggle"});
	
	this.pipeline = new Gst.Pipeline({name: "test"});
	// No actual introspection data for audiotestsrc, so can not
	// instantiate one with a constructor, have to use element_factory,
	// likewise for the others.
	this.audiosrc = Gst.ElementFactory.make("audiotestsrc", "audio");
	this.audiosink = Gst.ElementFactory.make("alsasink", "sink");
	this.volume = Gst.ElementFactory.make("volume", "vcontrol");
	this.audiosrc.freq = freq;
	
	this.pipeline.add(this.audiosrc);
	this.pipeline.add(this.audiosink);
	this.pipeline.add(this.volume);
	this.audiosrc.link(this.volume);
	this.volume.link(this.audiosink);
	
	this.playing = false;
	
	var adjustment = this.vscale.get_adjustment();
	adjustment.upper = 3000;
	adjustment.value = freq;
	
	var adjustment = this.volscale.get_adjustment();
	adjustment.upper = 10;
	adjustment.value = this.volume.volume;
	
	this.hbox.pack_start(this.vscale, true, true, 10);
	this.hbox.pack_start(this.volscale, true, true, 10);
	this.vbox.pack_start(this.hbox, true, true, 10);
	this.vbox.pack_start(this.button, false, false, 10);
	
	this.toggle = function(button, that) 
	{
		if (that.playing == false)
		{
			that.pipeline.set_state(Gst.State.playing);
			that.playing = true;
		}
		else
		{
			that.pipeline.set_state(Gst.State.paused);
			that.playing = false;
		}
	}
	this.update_freq = function(range, that)
	{
		that.audiosrc.freq = range.get_value();
	}
	this.update_vol = function(range, that)
	{
		that.volume.volume = range.get_value();
	}
	this.button.signal.clicked.connect(this.toggle, null, this);
	this.vscale.signal.value_changed.connect(this.update_freq, null, this);
	this.volscale.signal.value_changed.connect(this.update_vol, null, this);
}

function end_program()
{
	Gtk.main_quit();
}

var window = new Gtk.Window();
var button = new Gtk.Button({label: "Add Oscillator"});

window.signal.hide.connect(end_program);
window.resize(600,300);
var hbox = new Gtk.HBox();

var os1 = new oscillator(523.25);
var os2 = new oscillator(659.26);
var os3 = new oscillator(783.99);

function add_oscillator(button)
{
	var os = new oscillator(300);
	hbox.pack_start(os.vbox, true, true, 10);
	os.vbox.show_all();
}
button.signal.clicked.connect(add_oscillator);

window.add(hbox);
hbox.pack_start(button, true, true, 10);
hbox.pack_start(os1.vbox, true, true, 10);
hbox.pack_start(os2.vbox, true, true, 10);
hbox.pack_start(os3.vbox, true, true, 10);
window.show_all();


Gtk.main();

