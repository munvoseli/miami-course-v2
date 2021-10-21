var course_dict = {};

var button = document.getElementById("button");
var input = document.getElementById("course-input");
var output = document.getElementById("output");
var form = document.getElementById("form");

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
	console.log(course_section);
	return `${subject} ${number}  (${course_section.creditHoursDesc} credit hours)

${course_section.courseDescription || "[no description]"}`;
    }
    else
    {
	return "[course not found]";
    }
}

function load_subject(subject, callback)
{
    var scpt = document.createElement("script");
    scpt.src = `js/${subject}.js`;
    scpt.onload = function() {
	document.head.removeChild(scpt);
	callback();
    };
    document.head.appendChild(scpt);
}

function get_info_from_input ()
{
    var subject, id;
    [subject, id] = input.value.split(" ");
    if (!course_dict[subject])
    {
	load_subject(subject, get_info_from_input);
	return;
    }
    
    output.innerHTML = get_info( subject, id ) + "\n\n\n\n" + output.innerHTML;
}

button.addEventListener("click", get_info_from_input, false);

form.addEventListener("submit", function(e) {
    e.preventDefault();
    get_info_from_input();
}, false);
