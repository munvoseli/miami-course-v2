// this file is meant to make other tasks better
// and to establish a more readable thing

function timeToMinutes (time)
{
    return time.split(":").map(x=>parseInt(x)).reduce((h,m)=>(60*h+m));
}

// block of time, during 1 day
function constructSectionBlock (day, start, end)
{
    const res = {
	day   : {M:0, T:1, W:2, R:3, F:4}[day],
	start : timeToMinutes(start),
	end   : timeToMinutes(end)
    };
    if (res.day == null)
    {
	console.warn(":(", day);
	return false;
    }
    return res;
}

// full schedule for a single section
function constructSectionSchedule (miamiCourseSchedule)
{
    let sectionSchedule = [];
    for (let blockSet of miamiCourseSchedule)
    {
	if (!blockSet.days)
	{
	    console.log("Block set with no days", blockSet);
	    continue;
	}
	for (let day of blockSet.days)
	{
	    sectionSchedule.push(constructSectionBlock(day, blockSet.startTime, blockSet.endTime));
	}
    }
    return sectionSchedule; // aka block list
}

// info for a single section
function constructSectionInfo (miamiCourseSection)
{
    return {
	crn: miamiCourseSection.courseId, // "88804"
	letter: miamiCourseSection.courseSectionCode, // "A"
	fullName: miamiCourseSection.courseCode, // "CSE 271 A"
	credits: miamiCourseSection.creditHoursDesc, // "4"
	instructors: miamiCourseSection.instructors,
	schedule: constructSectionSchedule(miamiCourseSection.courseSchedules)
    };
}
