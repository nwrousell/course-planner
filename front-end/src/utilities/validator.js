"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequirementSatisfied = void 0;
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
            if (requirement?.overlapAllowed) {
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
exports.isRequirementSatisfied = isRequirementSatisfied;
