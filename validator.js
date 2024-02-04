"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Concentration_req_json_1 = __importDefault(require("./Concentration_req.json"));
function min(a, b) {
    if (a < b)
        return a;
    else
        return b;
}
// Returns [boolean, courses_used, min_courses_left_to_satisfy]
function isRequirementSatisfied(availableCourses, requirement) {
    let leftResponse, rightResponse, isSatisfied, coursesUsed, minCoursesLeft, foundCourse;
    switch (requirement.function) {
        case 'PICK':
            coursesUsed = [];
            // @ts-ignore
            for (let i = 0; i < requirement.value; i++) {
                // for each pick, find a course in availableCourses that is in requirement.courses
                //@ts-ignore
                foundCourse = false;
                for (let j = 0; j < availableCourses.length; j++) {
                    if (requirement.courses?.includes(availableCourses[j])) {
                        coursesUsed.push(availableCourses[j]);
                        availableCourses.splice(j, 1);
                        foundCourse = true;
                        break;
                    }
                }
                if (foundCourse)
                    continue;
                // if we got here, we have no more courses that can satisfy the requirement
                // @ts-ignore
                minCoursesLeft = requirement.value - coursesUsed.length;
                return [false, coursesUsed, minCoursesLeft];
            }
            return [true, coursesUsed, 0];
        case 'AND':
            leftResponse = isRequirementSatisfied(availableCourses, requirement["value"][0]);
            availableCourses = availableCourses.filter((v, i) => !leftResponse[1].includes(v));
            if (requirement?.overlapAllowed) { // ! this is broken
                // we want to use the same courses for both branches of the AND
                // so front-load the coursesUsed of the leftResponse in availableCourses  
                availableCourses = leftResponse[1].concat(availableCourses);
            }
            rightResponse = isRequirementSatisfied(availableCourses, requirement["value"][1]);
            isSatisfied = leftResponse[0] && rightResponse[0];
            coursesUsed = [...new Set(leftResponse[1].concat(rightResponse[1]))]; // converting to a Set and back to remove duplicates
            minCoursesLeft = leftResponse[2] + rightResponse[2]; // ! this won't work with overlap
            return [isSatisfied, coursesUsed, minCoursesLeft];
        case 'OR':
            leftResponse = isRequirementSatisfied(availableCourses, requirement["value"][0]);
            rightResponse = isRequirementSatisfied(availableCourses, requirement["value"][1]);
            isSatisfied = leftResponse[0] || rightResponse[0];
            minCoursesLeft = min(leftResponse[2], rightResponse[2]);
            coursesUsed = (leftResponse[2] == minCoursesLeft) ? leftResponse[1] : rightResponse[1];
            return [isSatisfied, coursesUsed, minCoursesLeft];
        case 'ANY-ABOVE-1000':
            coursesUsed = [];
            let department, number;
            // @ts-ignore
            for (let i = 0; i < requirement.value; i++) {
                // for each pick, find a course in availableCourses that is 1000-level and of department courses[0]
                //@ts-ignore
                foundCourse = false;
                for (let j = 0; j < availableCourses.length; j++) {
                    department = availableCourses[j].split(" ")[0];
                    number = parseInt(availableCourses[j].split(" ")[1]);
                    // @ts-ignore
                    if (department == requirement.courses[0] && number >= 1000) {
                        coursesUsed.push(availableCourses[j]);
                        availableCourses.splice(j, 1);
                        foundCourse = true;
                        break;
                    }
                }
                if (foundCourse)
                    continue;
                // if we got here, we have no more courses that can satisfy the requirement
                // @ts-ignore
                minCoursesLeft = requirement.value - coursesUsed.length;
                return [false, coursesUsed, minCoursesLeft];
            }
            return [true, coursesUsed, 0];
    }
}
console.log(Concentration_req_json_1.default);
// set up classes the student has already taken
const alreadyTaken = ["CSCI 0190", "CSCI 0300", "ECON 1110", "ECON 0110",
    "CSCI 1951A", "CLPS 0220", "CLPS 0700", "MATH 0520", "APMA 1650", "MATH 0200", "MATH 0100", "CSCI 2470", "CSCI 1430", "CSCI 1951Z", "HIST 0234", "CSCI 0220"];
const requirements = Concentration_req_json_1.default["Concentrations"]["CS"]["AB"];
for (const req of requirements) {
    const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(alreadyTaken, req);
    console.log(`Requirement: ${req.name}, satisfied: ${satisfied}, coursesUsed: ${coursesUsed.join(", ")}, # coursesLeft: ${coursesLeft}`);
}
// ! CS19's second slot will take the next available CS, which isn't always the best choice
// ! (it could take cs300, which then can't be used for intermediate courses)
// To compile: tsc .\validator.ts --resolveJsonModule --module nodenext
// to run node validator.js
