#!/usr/local/bin/seed
Seed.import_namespace("Clutter");
Seed.import_namespace("GLib");

const RIPPLE_S = 2000;
const RIPPLE_W = 8;
const RIPPLE_G = 2;
const RIPPLE_N = 5;
const RIPPLE_MIND = 450;
const RIPPLE_MAXD = 2000;
const RIPPLE_WX = Clutter.double_to_fixed(RIPPLE_W);

const SCREEN_W = 640;
const SCREEN_H = 480;

function angle_from_deg(x)
{
	return (((x) * 1024.0) / 360.0);
}

function alpha_func(alpha)
{
	var timeline = alpha.get_timeline();
	var frame = timeline.get_current_frame();
	var n_frames = timeline.num_frames;
	var fps = timeline.fps;
	var duration = n_frames/fps;
	var time = frame/fps;
	
	if ((time/=duration) < (1/2.75))
		return Clutter.ALPHA_MAX_ALPHA*(7.5625*time*time);
	else if (time < (2/2.75))
		return Clutter.ALPHA_MAX_ALPHA*(7.5625 * 
										(time-=(1.5/2.75))*time+.75);
	else if (time < (2.5/2.75))
		return Clutter.ALPHA_MAX_ALPHA*(7.5625 *
										(time-=(2.25/2.75))*time+.9375);
	else
		return Clutter.ALPHA_MAX_ALPHA*(7.5625 *
										(time-=(2.625/2.75))*time+.984375);


}

function destroy_actor(actor)
{
	actor.destroy();
}

function circle_paint (actor)
{
	var radius = Clutter.double_to_fixed(actor.width/2);
	
	actor.fill_color.alpha = actor.opacity;
	
	Clutter.cogl_color(actor.fill_color);
	Clutter.cogl_path_move_to(radius, radius);
	Clutter.cogl_path_arc(radius, radius, radius, radius,
						  angle_from_deg(0),
						  angle_from_deg(360));
	Clutter.cogl_path_line_to(radius - RIPPLE_WX/2, radius);
	Clutter.cogl_path_arc(radius, radius, 
						  radius-RIPPLE_WX/2, radius-RIPPLE_WX/2,
						  angle_from_deg(0),
						  angle_from_deg(360));
	Clutter.cogl_path_close();
	Clutter.cogl_path_fill();	
}

function ripple(stage, x, y)
{
	var transp = new Clutter.Color();
	
	var n = parseInt(Math.random()*RIPPLE_N)+1;
	
	for (i = 0; i < n; i++)
	{
		var actor = new Clutter.Rectangle({color: transp});
		
		actor.fill_color = new Clutter.Color({red: 0xff,
											  green: 0xff,
											  blue: 0xff});
	


		var size = ((RIPPLE_W * 2) * (i+1)) + (RIPPLE_G * i);
		
		actor.width = actor.height = size;
		actor.set_anchor_point_from_gravity(Clutter.Gravity.Center);
		actor.x = x;
		actor.y = y;
		actor.opacity = 0x80;
		
		stage.add_actor(actor);
		
		actor.signal["paint"].connect(circle_paint);
		Clutter.effect_scale(template,actor,
							 SCREEN_W / RIPPLE_W,
							 SCREEN_W / RIPPLE_W);
		Clutter.effect_fade(template, actor,
							0x00,
							destroy_actor);
						
	}
}

Clutter.init(null, null);

var template = 
	new Clutter.EffectTemplate.for_duration(RIPPLE_S,
											alpha_func);

var stage = new Clutter.Stage();
stage.width = SCREEN_W; stage.height = SCREEN_H;
stage.color = {red: 0xe0, green: 0xf2, 
			   blue: 0xfc, alpha: 0xff};

stage.signal["button_press_event"].connect(
	function(stage, event)
	{
		ripple(stage, event.button.x, event.button.y);
		
		return true;
	});

stage.show();

function random_ripple()
{
	ripple(stage,
		   Math.random()*SCREEN_W,
		   Math.random()*SCREEN_H);
	GLib.timeout_add(Math.random()*RIPPLE_MAXD + RIPPLE_MIND,
					 random_ripple);
	return false;
}

random_ripple();

Clutter.main();


