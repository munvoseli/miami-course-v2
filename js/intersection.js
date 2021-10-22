// course section schedule: from course section
// section schedule: array of blocks
// block: {char day, int start, int end}

function are_blocks_intersect( a, b )
{
    return !(a.day != b.day || a.end < b.start - 20 || b.end < a.start - 20);
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
	    block_list.push({day: day,
			     start: time_to_minutes(part.startTime),
			     end: time_to_minutes(part.endTime)});
	}
    }
    return block_list;
}

function get_block_list_list( a_secsched )
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
}

document.getElementById("suggestions").onclick = function(e) {
    e.target.innerHTML = "";
    start_testing(aa_schedule_global);
};
