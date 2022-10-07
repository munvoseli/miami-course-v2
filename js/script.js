var course_dict = {};

var button = document.getElementById("button");
var input = document.getElementById("course-input");
var output = document.getElementById("output");
var form = document.getElementById("form");

var aa_schedule_global = [];
var aSectionInfo = [];

function get_info (subject, number)
{
    var course_section;
    var found_course = 0;
    for (course_section of course_dict[subject].courseSections)
    {
	if (course_section.courseNumber == number)
	{
	    found_course = 1;
	    break;
	}
    }
    if (found_course)
    {
	//console.log(course_section);
	return `${subject} ${number}  (${course_section.creditHoursDesc} credit hours)

${course_section.courseDescription || "[no description]"}`;
    }
    else
    {
	return "[course not found]";
    }
}
/*
var colors = `\
ff0000
00ff00
0000ff
ffff00
ff00ff
00ffff
000000
aa1166`.split("\n").map(x=>"#"+x);
*/
const colors = ["#beedab", "#bcd", "#aaaaaa",
		"#beeee5", "#c58",
		"#e79e00", "#c6d"];
var color_index = 0;

function get_next_color()
{
    if (color_index < colors.length)
	return colors[color_index++];
    else
    {
	var str = parseInt(Math.random() * (1<<24)).toString(16);
	while (str.length < 6)
	    str = "0" + str;
	return "#" + str;
    }
}

function is_time_okay( secsched )
{
    return true;
    for (var day of secsched)
    {
	if (time_to_minutes(day.startTime) < time_to_minutes("9:00"))
	    return false;
	if (time_to_minutes(day.endTime) > time_to_minutes("18:00"))
	    return false;
    }
    return true;
}

function remove_null_days(course_section)
{
    for (var i = 0; i < course_section.courseSchedules.length; ++i)
    {
	if (course_section.courseSchedules[i].days == null)
	{
	    course_section.courseSchedules.splice(i, 1);
	    --i;
	}
    }
}

function make_class_buttons(subject, number)
{
    var color = get_next_color();
    var elClass = document.createElement("span");
    elClass.classList.add("section-list-label");
    elClass.innerHTML = subject + " " + number + " ";
    document.getElementById("course-buttons").appendChild(elClass);
    elClass.style.backgroundColor = color;
    var a_sched = [];
    for (var course_section of course_dict[subject].courseSections)
    {
	if (course_section.courseNumber == number)
	{
	    if (!course_section.courseSchedules.length)
		continue;
	    const sectionInfo = constructSectionInfo(course_section);
	    aSectionInfo.push(sectionInfo);
	    
	    let button = document.createElement("input");
	    let label = document.createElement("label");
	    button.setAttribute("type", "radio");
	    button.setAttribute("name", subject + number);
	    button.setAttribute("value", sectionInfo.letter);
	    button.setAttribute("id", sectionInfo.fullName);
	    label.setAttribute("for", sectionInfo.fullName);
	    remove_null_days(course_section);
	    button.section = course_section;
	    button.schedule = course_section.courseSchedules;
	    button.sectionInfo = sectionInfo;
	    if (is_time_okay(button.schedule))
		a_sched.push(course_section);
	    button.color = color;
	    button.addEventListener("click", function(e) {
		display_all();
	    }, false);
	    label.innerHTML = course_section.courseSectionCode;
	    button.classList.add("section-radio");
	    label.classList.add("section-radio-label");
	    document.getElementById("course-buttons").appendChild(button);
	    document.getElementById("course-buttons").appendChild(label);
	}
    }
    document.getElementById("course-buttons").appendChild(document.createElement("br"));
    aa_schedule_global.push(a_sched);
}

function load_subject(subject, callback)
{
    var scpt = document.createElement("script");
    scpt.src = `coursedata/${subject}.jsonp`;
    scpt.onload = function() {
	document.head.removeChild(scpt);
	callback();
    };
    document.head.appendChild(scpt);
}


async function load_subject_blocking(subject)
{
    var scpt = document.createElement("script");
    scpt.src = `coursedata/${subject}.jsonp`;
    document.head.appendChild(scpt);
    await new Promise(resolve => {
	scpt.onload = function() {
	    document.head.removeChild(scpt);
	    //console.log("resolved");
	    resolve(5);
	};
    });
    //console.log("exited");
}

async function makeCourseInputs(subject, id) {
    if (!course_dict[subject]) {
	await load_subject_blocking(subject);
    }
    if (!course_dict[subject]) {
	console.error("didn't actually block");
    }
    make_class_buttons( subject, id );
    output.innerHTML = get_info( subject, id ) + "\n\n\n\n" + output.innerHTML;
}

function get_info_from_input ()
{
    for (let line of input.value.split("\n")) {
	if (line.length == 0) {
	    continue;
	}
	var subject, id;
	[subject, id] = line.split(" ");
	makeCourseInputs(subject, id);
    }
}

button.addEventListener("click", get_info_from_input, false);

form.addEventListener("submit", function(e) {
    e.preventDefault();
    get_info_from_input();
}, false);

function add_class_by_name( onm )
{
    var subject, number;
    [subject, number] = onm.split(" ");
    if (!course_dict[subject])
    {
	load_subject(subject, function() {add_class_by_name(onm)});
	return;
    }
    
    make_class_buttons( subject, number );
}

if (location.href[0] == "m")
{
    var classes = `\
MTH 222
MTH 231`.split("\n");
    classes.forEach(add_class_by_name);
    setTimeout(function() {
	"MTH 222 B.MTH 231 A".split(".").forEach((x => document.getElementById(x).click()));
    }, 100);
}
