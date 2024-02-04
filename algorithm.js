"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingSemesters = void 0;
const Concentration_req_json_1 = __importDefault(require("./Concentration_req.json"));
const all_courses_json_1 = __importDefault(require("./data/all_courses.json"));
function getPicks(req, courses_taken) {
    let leftSide, rightSide;
    let remainingCourses = [];
    let remainingNum;
    switch (req.function) {
        case "PICK":
            let remainingNum = req.value;
            let reqCopies = req.courses;
            const prevIndices = [];
            // Filtering out courses that have been taken already
            reqCopies = reqCopies.filter((course) => {
                if (courses_taken.includes(course)) {
                    remainingNum--; // Decrement remainingNum for each course taken
                    return false; // Exclude the course from the filtered array
                }
                return true; // Include the course in the filtered array
            });
            // Picking from the filtered list
            for (let k = 0; k < remainingNum; k++) {
                let num = Math.floor(Math.random() * reqCopies.length);
                while (prevIndices.includes(num)) {
                    num = Math.floor(Math.random() * reqCopies.length);
                }
                prevIndices.push(num);
                remainingCourses.push(reqCopies[num]);
            }
            console.log("test");
            console.log(remainingCourses);
            break;
        //   case "PICK":
        //     remainingNum = req.value as number;
        //     const prevIndices: number[] = [];
        //     let reqCopies = req.courses!;
        //     //filtering out courses that have been taken already
        //     for(const course in reqCopies){
        //         if(courses_taken.includes(course)){
        //             reqCopies = reqCopies.filter((v) => !courses_taken.includes(course));
        //             remainingNum--;
        //         }
        //     }
        //     //picking from filtered list
        //     for (let k = 0; k < remainingNum; k++) {
        //       let num: number = Math.random() * reqCopies?.length!;
        //       while (prevIndices.includes(num)) {
        //         num = Math.random() * reqCopies?.length!;
        //       }
        //       prevIndices.push(num);
        //         remainingCourses.push(reqCopies[num]);
        //     }
        //     console.log("test");
        //     console.log(remainingCourses);
        //     break;
        case "OR":
            leftSide = req.value[0];
            const listVal1 = getPicks(leftSide, courses_taken);
            rightSide = req.value[1];
            const listVal2 = getPicks(rightSide, courses_taken);
            if (listVal1.length < listVal2.length) {
                return listVal1;
            }
            else {
                return listVal2;
            }
            break;
        case "AND":
            leftSide = req.value[0];
            const listVal3 = getPicks(leftSide, courses_taken);
            rightSide = req.value[1];
            const listVal4 = getPicks(rightSide, courses_taken);
            return listVal3.concat(listVal4);
            break;
        case "ANY-ABOVE-1000":
            //getPicks(req.value[0], missingList[n]);
            break;
    }
    return remainingCourses;
}
function getRemainingSemesters(coursesTaken, semestersTaken, interestedSubjects, concentration, type) {
    const semesterCourses = [];
    const concentrationReq = () => JSON.parse(JSON.stringify(Concentration_req_json_1.default))[concentration][type];
    //   for (const key in concentrationReq) {
    //     //TODO: Making total coursesLeft list
    //     //coursesLeft.push(...[isRequirementSatisfied(courses_taken, requirement)[1]])
    //   }
    let requirements = Concentration_req_json_1.default["Concentrations"][concentration];
    let coursesRemaining = [""];
    //   let missingList : number[] = [];
    //   for (const req of requirements) {
    //     const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(
    //       coursesTaken,
    //       req
    //     );
    //     missingList.push(coursesLeft)
    //   }
    //   console.log(missingList);
    let n = 0;
    for (const req of requirements) {
        coursesRemaining.concat(getPicks(req, coursesTaken));
    }
    console.log("required courses:");
    console.log(coursesRemaining);
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
    console.log("sorted courses:");
    console.log(sortedCourses);
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
