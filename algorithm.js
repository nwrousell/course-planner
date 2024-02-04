"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingSemesters = void 0;
const Concentration_req_json_1 = __importDefault(require("./Concentration_req.json"));
const all_courses_json_1 = __importDefault(require("./data/all_courses.json"));
const validator_1 = require("./front-end/src/utilities/validator");
function getRemainingSemesters(coursesTaken, semestersTaken, interestedSubjects, concentration, type) {
    const semesterCourses = [];
    const concentrationReq = () => JSON.parse(JSON.stringify(Concentration_req_json_1.default))[concentration][type];
    //   for (const key in concentrationReq) {
    //     //TODO: Making total coursesLeft list
    //     //coursesLeft.push(...[isRequirementSatisfied(courses_taken, requirement)[1]])
    //   }
    let requirements = Concentration_req_json_1.default["Concentrations"][concentration];
    let coursesRemaining = [""];
    let stuff = [];
    for (const req of requirements) {
        const [satisfied, coursesUsed, coursesLeft] = (0, validator_1.isRequirementSatisfied)(coursesTaken, req);
        stuff.push(coursesLeft);
    }
    console.log("contents:");
    console.log(stuff);
    //   let n = 0;
    //   for(const req of requirements){
    //     switch(req.function){
    //         case "PICK":
    //             break;
    //         case "OR":
    //         case "AND":
    //         case "ANY-ABOVE-1000":
    //     }
    //     n++;
    //   }
    const sortedCourses = coursesRemaining.sort((a, b) => {
        const [aPrefix, aNumber] = a.split(" ");
        const [bPrefix, bNumber] = b.split(" ");
        const aNumberInt = parseInt(aNumber);
        const bNumberInt = parseInt(bNumber);
        if (aNumberInt < bNumberInt) {
            return -1;
        }
        else if (aNumberInt > bNumberInt) {
            return 1;
        }
        else {
            return aPrefix.localeCompare(bPrefix);
        }
    });
    let pos = 0;
    const averageConcentrationCourses = sortedCourses.length / (8 - semestersTaken);
    while (coursesRemaining.length > 0) {
        const isSpring = (semestersTaken + pos) % 2 === 1;
        let semesterNumber = semestersTaken + pos;
        const semester = {
            semesterNum: semesterNumber,
            courses: [],
        };
        for (let i = 0; i < averageConcentrationCourses; i++) {
            if (coursesRemaining.length === 0) {
                break;
            }
            while (true) {
                let n = 0;
                if (isSpring) {
                    if (all_courses_json_1.default[sortedCourses[n]]["term"].split(" ")[0] === "Spring") {
                        semester["courses"].push(coursesRemaining[n]);
                        coursesRemaining.splice(n, 1);
                    }
                    else {
                        n++;
                    }
                }
                else {
                    if (all_courses_json_1.default[sortedCourses[n]]["term"].split(" ")[0] === "Fall") {
                        semester["courses"].push(coursesRemaining[n]);
                        coursesRemaining.splice(n, 1);
                    }
                    else {
                        n++;
                    }
                }
            }
        }
        //TODO: If we're adding other courses
        // if(semester["courses"].length != 4){
        //     for(let n = 0; n < 4- semester["courses"].length){
        //     }
        // }
        semesterCourses.unshift(semester);
        pos++;
    }
    return semesterCourses;
}
exports.getRemainingSemesters = getRemainingSemesters;
const concentration = "CS";
const type = "AB";
const semestersTaken = 0;
const coursesTaken = [];
console.log("test");
console.log(getRemainingSemesters(coursesTaken, 0, [], "N_CS", "AB"));
