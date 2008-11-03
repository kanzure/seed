#!/usr/local/bin/seed
function ShaderView(source_type, actor, reflection)
{
    this.hbox = new Gtk.HBox();
    
    var source_lang_mgr = new GtkSource.SourceLanguageManager();
    var js_lang = source_lang_mgr.get_language("c");

    var source_buf = new GtkSource.SourceBuffer({language: js_lang});
    source_buf.text = Gio.simple_read("default.glsl");
    var source_view = GtkSource.SourceView.new_with_buffer(source_buf);
    source_view.set_show_line_numbers(true);
    source_view.set_show_right_margin(true);
    source_view.set_highlight_current_line(true);
    source_view.set_right_margin_position(80);
    
    this.source_type = source_type;
    
    var compile = new Gtk.Button({label: "Compile"});

    var scrolled_window = new Gtk.ScrolledWindow(
			   {vscrollbar_policy: Gtk.PolicyType.automatic, 
			    hscrollbar_policy: Gtk.PolicyType.automatic});
    scrolled_window.add(source_view);
    
    this.hbox.pack_start(scrolled_window, true, true);
    this.hbox.pack_start(compile);
    this.actor = actor;
    this.reflection = reflection;
    
    this.make_shader = function()
    {
	shader.enabled = false;
	if (this.source_type == "fragment_source")
	    shader.fragment_source = source_buf.text;
	else
	    shader.vertex_source = source_buf.text;
	shader.compile();
	shader.enabled = true;
	this.actor.set_shader(shader);
	this.reflection.set_shader(shader);
    }

    compile.signal_clicked.connect(this.make_shader, this);
}