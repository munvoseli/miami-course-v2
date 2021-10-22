var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

const day_lookup = {M: 0, T: 1, W: 2, R: 3, F: 4};

function time_to_minutes( time )
{
    var hours, mins;
    [hours, mins] = time.split(":").map(x=>Number(x));
    return hours * 60 + mins;
}

function time_to_coords( time, weekday )
{
    time = time_to_minutes(time);
    var x = 25 * (weekday + 5) * Math.sin(time * Math.PI * 2 / 24 / 60) + canvas.width / 2;
    var y = 25 * (weekday + 5) * -Math.cos(time * Math.PI * 2 / 24 / 60) + canvas.height / 2;
    return [x, y];
}

function draw_background()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    for (var i = 0; i < 5; ++i)
    {
	ctx.beginPath();
	ctx.arc(cx, cy, (i + 5) * 25, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#aaa";
	ctx.stroke();
	ctx.closePath();
    }
    ctx.beginPath();
    var r0 = 5 * 25;
    var r1 = 9 * 25;
    for (var i = 9; i <= 21; ++i)
    {
	var th = i / 24 * 2 * Math.PI;
	var c = Math.sin(th);
	var s = -Math.cos(th);
	ctx.moveTo(cx + r0 * c, cy + r0 * s);
	ctx.lineTo(cx + r1 * c, cy + r1 * s);
    }
    ctx.stroke();
    ctx.closePath();
}

draw_background();

function put_day_on_canvas( start, end, weekday )
{
    var day = day_lookup[weekday];
    /*var x0, y0, x1, y1;
    [x0, y0] = time_to_coords(start, day);
    [x1, y1] = time_to_coords(end, day);*/
    var r = (day + 5) * 25;
    var o = -Math.PI / 2;
    var th0 = time_to_minutes(start) * Math.PI * 2 / 24 / 60 + o;
    var th1 = time_to_minutes( end ) * Math.PI * 2 / 24 / 60 + o;
    ctx.beginPath();
    //ctx.moveTo(x0, y0);
    //ctx.lineTo(x1, y1);
    ctx.arc(canvas.width / 2, canvas.height / 2, r, th0, th1);
    ctx.lineWidth = 10;
    //ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();
}

function put_schedule_part_on_canvas( part )
{
    var start = part.startTime;
    var end = part.endTime;
    for (var letter of part.days)
    {
	put_day_on_canvas(part.startTime, part.endTime, letter);
    }
}

function put_schedule_on_canvas( courseSchedules, color )
{
    ctx.strokeStyle = color;
    for (var part of courseSchedules)
	put_schedule_part_on_canvas( part, color );
}

function span_text_schedule(schedule, color, parent)
{
    for (var part of schedule)
    {
	var span = document.createElement("span");
	span.innerHTML = part.days + " " + part.startTime + " " + part.endTime;
	span.style.backgroundColor = color;
	parent.appendChild(span);
	parent.appendChild(document.createElement("br"));
    }
}

function span_text(text, color, parent)
{
    var span = document.createElement("span");
    span.innerHTML = text;
    span.style.backgroundColor = color;
    parent.appendChild(span);
    parent.appendChild(document.createElement("br"));
}

function display_text_schedule()
{
    var parent = document.getElementById("course-text-schedule");
    while (parent.children.length)
	parent.removeChild(parent.children[0]);
    var buttons = document.getElementById("course-buttons");
    for (var child of buttons.children)
    {
	if (child.checked)
	{
	    span_text_schedule(child.schedule, child.color, parent);
	}
    }
}

function display_more_info()
{
    var parent = document.getElementById("course-text-schedule");
    var total_ch = 0;
    var buttons = document.getElementById("course-buttons");
    for (var child of buttons.children)
    {
	if (child.checked)
	{
	    total_ch += Number(child.section.creditHoursDesc);
	}
    }
    span_text(total_ch, "#cde", parent);
}

function redraw_all()
{
    var parent = document.getElementById("course-buttons");
    draw_background();
    for (var child of parent.children)
    {
	if (child.checked)
	{
	    put_schedule_on_canvas( child.schedule, child.color );
	}
    }
}

function display_all()
{
    redraw_all();
    display_text_schedule();
    display_more_info();
}
