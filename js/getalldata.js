let course_dict = {};
let subjects = `AA ACC AER AES ACE AMS ATH APC ASO ARB ARC ART AAA BSC BIO BWS BOT BUS BLS BTE CPB CPE CHM CHI CRD CLS CLA CEC CAS CCA CMR COM CMA CIT CSE CMS CJS CRE DSC DST ECO EHS EDL EDP ECE IMS EAS EGM ENT ENG EGS ESP ENV IES FSW FAS FST FIN FRE GEO GLG GER GTY GIC GHS GSC GRK HBW HIN HST HON HUM ISA LR BIS IDS ITS ITL JPN JRN KNH KOR LAS LAT LST LIN LUX MGT MKT MTH MME MAC MJF MBI MSC MUS NSC NCS NSG ORG PCE PHL PHY POL POR PLW PMD CPS PSS PSY REL RUS SCA SJS SOC SPN SPA SLM STA STC EDT THE UNV WST WGS ZOO`.split(" ");
let res_dict = {};
let nleft = subjects.length;
for (let subject of subjects) {
	let scr = document.createElement("script");
	scr.onload = function() {
//		console.log(subject, course_dict[subject]);
		for (sec of course_dict[subject].courseSections) {
//			console.log(subject, sec.courseNumber, sec.courseDescription);
			if (sec.creditHoursHigh != sec.creditHoursLow) {
//				console.log(sec.instructionalType + " " + sec.creditHoursDesc + " " + sec.courseTitle + "\n" + sec.instructionalTypeDescription);
			}
			let outstr = `course\nid ${subject} ${sec.courseNumber}\ndesc ${sec.courseDescription ? sec.courseDescription.replaceAll(/\n/g, "\\n") : "no description"}\nch ${sec.creditHoursLow} ${sec.creditHoursHigh}\n\n`;
			res_dict[subject + sec.courseNumber] = outstr;
		}
		--nleft;
		if (nleft == 0) loadIntoTextarea();
	}
	scr.src = "coursedata/" + subject + ".jsonp";
	document.head.appendChild(scr);
}

function loadIntoTextarea() {
	let textarea = document.createElement("textarea");
	document.body.appendChild(textarea);
	let text = "";
	for (let h in res_dict) {
		console.log(h);
		text += res_dict[h];
	}
	textarea.value = text;
}
