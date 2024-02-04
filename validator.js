"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Concentration_req_json_1 = __importDefault(require("./Concentration_req.json"));
// Read concentration reqs json file
// const CONCENTRATION_REQUIREMENTS = await ((await fetch("./Concentration_req.json")).json())
console.log(Concentration_req_json_1.default);
// set up classes the student has already taken
const alreadyTaken = ["CSCI 0190", ""];
function min(a, b) {
    if (a < b)
        return a;
    else
        return b;
}
// Returns [boolean, courses_used, min_courses_left_to_satisfy]
function isRequirementSatisfied(availableCourses, requirement) {
    let leftResponse, rightResponse, isSatisfied, coursesUsed, minCoursesLeft;
    switch (requirement.function) {
        case 'PICK':
            coursesUsed = [];
            // @ts-ignore
            for (let i = 0; i < requirement.value; i++) {
                // for each pick, find a course in availableCourses that is in requirement.courses
                //@ts-ignore
                for (let j = 0; j < availableCourses.length; j++) {
                    if (requirement.courses?.includes(availableCourses[j])) {
                        coursesUsed.push(availableCourses[j]);
                        availableCourses.splice(j, 1);
                    }
                }
                // if we got here, we have no more courses that can satisfy the requirement
                // @ts-ignore
                minCoursesLeft = requirement.value - coursesUsed.length;
                return [false, coursesUsed, minCoursesLeft];
            }
            return [true, coursesUsed, 0];
        case 'AND':
            leftResponse = isRequirementSatisfied(availableCourses, requirement["value"][0]);
            rightResponse = isRequirementSatisfied(availableCourses, requirement["value"][1]);
            isSatisfied = leftResponse[0] && rightResponse[0];
            coursesUsed = [...new Set(leftResponse[1] + rightResponse[1])]; // converting to a Set and back to remove duplicates
            minCoursesLeft = leftResponse[2] + rightResponse[2];
            return [isSatisfied, coursesUsed, minCoursesLeft];
        case 'OR':
            leftResponse = isRequirementSatisfied(availableCourses, requirement["value"][0]);
            rightResponse = isRequirementSatisfied(availableCourses, requirement["value"][1]);
            isSatisfied = leftResponse[0] || rightResponse[0];
            minCoursesLeft = min(leftResponse[2], rightResponse[2]);
            coursesUsed = (leftResponse[2] == minCoursesLeft) ? leftResponse[1] : rightResponse[1];
            return [isSatisfied, coursesUsed, minCoursesLeft];
    }
}
// To compile: tsc .\validator.ts --resolveJsonModule --module nodenext
// to run node validator.js
