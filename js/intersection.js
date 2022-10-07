// course section schedule: from course section
// section schedule: array of blocks
// block: {char day, int start, int end}

function are_blocks_intersect( a, b )
{
    return !(a.day != b.day || a.end < b.start - 0 || b.end < a.start - 0);
}

function are_two_block_lists_intersect( a, b )
{
    for (var ablock of a)
	for (var bblock of b)
	    if ( are_blocks_intersect(ablock, bblock) )
		return true;
    return false;
}

function does_block_list_list_intersect( arr )
{
    for (var i = 1; i < arr.length; ++i)
	for (var j = 0; j < i; ++j)
	    if (are_two_block_lists_intersect(arr[i], arr[j]))
		return true;
    return false;
}

// api course schedule -> block list
function get_block_list( sched )
{
    var block_list = [];
    for (var part of sched)
    {
	for (var day of part.days)
	{
	    block_list.push({
		day: day,
		start: time_to_minutes(part.startTime),
		end: time_to_minutes(part.endTime)
	    });
	}
    }
    return block_list;
}

/*function get_block_list_list( a_secsched )
{
    return a_secsched.map(get_block_list);
}

function test_schedule_for_intersection( aa_block_list, a_section_id,
					 aa_sec_label )
{
    if (a_section_id.length != aa_block_list.length)
    {
	a_section_id.length = aa_block_list.length;
	for (var i = 0; i < aa_block_list.length; ++i)
	    a_section_id[i]
	    = Math.floor(Math.random() * aa_block_list[i].length);
    }
    // one for each course
    var a_block_list = [];
    for (var i = 0; i < aa_block_list.length; ++i)
    {
	a_block_list[i] = aa_block_list[i][a_section_id[i]];
    }
    var res = does_block_list_list_intersect(a_block_list);
    if (res) // intersection occurred
    {
	setTimeout(function() {
	    test_schedule_for_intersection( aa_block_list, [], aa_sec_label );
	});
    }
    else
    {
	console.log(aa_sec_label, a_section_id);
	var str = "";
	for (var i = 0; i < aa_sec_label.length; ++i)
	{
	    str += aa_sec_label[i][a_section_id[i]] + "\n";
	}
	document.getElementById("suggestions").innerHTML = str;
    }
}

// start testing the list of section lists
function start_testing( aa_sec )
{
    // get an array of classes
    // each of which contains a block list for each section
    console.log(aa_sec);
    console.log(aa_sec.map(x=>x.map(y=>y.courseCode)));
    var aa_block_list = aa_sec.map(x=>get_block_list_list(x.map(y=>y.courseSchedules)));
    var aa_sec_label = aa_sec.map(x=>x.map(y=>y.courseCode));
    test_schedule_for_intersection(aa_block_list, [], aa_sec_label);
}*/



function testThings(courseBlocks, cur) {
    if (cur.length == courseBlocks.length) {
	return [[].concat(cur)];
    }
    // check for collisions
    let workingSchedules = [];
    for (let si = 0; si < courseBlocks[cur.length].length; ++si) {
	let newsec = courseBlocks[cur.length][si];
	let compatible = true;
	geralds:
	for (let ci = 0; ci < cur.length; ++ci) {
	    let sec = courseBlocks[ci][cur[ci]];
	    let intersect = are_two_block_lists_intersect(sec.sessions, newsec.sessions);
	    // if this section is incompatible, throw it out
	    if (intersect) {
		console.log(sec.section.courseCode, newsec.sessions, cur.join(" "));
		compatible = false;
		break geralds;
	    }
	}
	if (compatible) {
	    cur.push(si);
	    workingSchedules = workingSchedules.concat(testThings(courseBlocks, cur));
	    cur.pop();
	}
    }
    return workingSchedules;
}

function schedButton(sections) {
    for (let s of sections) {
	let rin = document.getElementById(s);
	rin.click();
    }
}

// each element of the input array is a list of sections for a course
function start_testing(aa, sdiv) {
    // each element of the following array is a list of time-block-sets for sections.
    // [course][section].sessions[block] represents "11-12 on mondays"
    // [course][section].section is a reference to the section
    let courseBlocks = [];
    for (let ci = 0; ci < aa.length; ++ci) { // over courses
	courseBlocks[ci] = [];
	for (let si = 0; si < aa[ci].length; ++si) { // over sections
	    let section = aa[ci][si];
	    let blocks = get_block_list(section.courseSchedules);
	    courseBlocks[ci][si] = {
		section: section,
		sessions: blocks
	    };
	}
    }
    console.log(courseBlocks);
    let workingSchedules = testThings(courseBlocks, []);
    console.log(workingSchedules);
    for (let s of workingSchedules) {
	let button = document.createElement("button");
	button.numbers = s;
	button.schedule = [];
	let h = "";
	for (let ci = 0; ;) {
	    let v = courseBlocks[ci][s[ci]].section.courseCode;
	    h += v;
	    button.schedule.push(v);
	    ++ci;
	    if (ci == s.length) {
		break;
	    } else {
		h += ", ";
	    }
	}
	button.innerHTML = h;
	button.style.display = "block";
	button.addEventListener("click", function() {
	    schedButton(button.schedule);
	}, false);
	sdiv.appendChild(button);
    }
}

document.getElementById("suggest").onclick = function(e) {
    let sdiv = document.getElementById("suggestions");
    while (sdiv.children.length) sdiv.removeChild(sdiv.lastChild);
    //e.target.innerHTML = "";
    let h = start_testing(aa_schedule_global, sdiv);
    //e.target.innerHTML = h;
};
