import Concentration_req from './Concentration_req.json'
// Read concentration reqs json file
// const CONCENTRATION_REQUIREMENTS = await ((await fetch("./Concentration_req.json")).json())
console.log(Concentration_req)

// set up classes the student has already taken
const alreadyTaken = ["CSCI 0190", ""]

// 
type Requirement = {
    name: String
    function: 'PICK' | 'AND' | 'OR' | 'ANY'
    value: number | Requirement[]
    courses?: String[]
}

const course_list = () => JSON.parse(JSON.stringify(Concentration_req));
const requirements = course_list["placeholder"];

function min(a: number, b: number){
    if(a < b) return a
    else return b
}

// Returns [boolean, courses_used, min_courses_left_to_satisfy]
function isRequirementSatisfied(availableCourses: String[], requirement: Requirement) {
    let leftResponse, rightResponse, isSatisfied, coursesUsed, minCoursesLeft
    switch(requirement.function){
        case 'PICK':
            coursesUsed = []
            // @ts-ignore
            for(let i=0;i<requirement.value;i++){
                // for each pick, find a course in availableCourses that is in requirement.courses
                //@ts-ignore
                for(let j=0;j<availableCourses.length;j++){
                    if(requirement.courses?.includes(availableCourses[j])){
                        coursesUsed.push(availableCourses[j])
                        availableCourses.splice(j, 1)
                    }
                }
                // if we got here, we have no more courses that can satisfy the requirement
                // @ts-ignore
                minCoursesLeft = requirement.value - coursesUsed.length
                return [false, coursesUsed, minCoursesLeft]
            }
            return [true, coursesUsed, 0]
        case 'AND':
            leftResponse = isRequirementSatisfied(
              availableCourses,
              requirement["value"][0]
            );
            rightResponse = isRequirementSatisfied(
              availableCourses,
              requirement["value"][1]
            );

            isSatisfied = leftResponse[0] && rightResponse[0]
            coursesUsed = [...new Set(leftResponse[1] + rightResponse[1])] // converting to a Set and back to remove duplicates
            minCoursesLeft =  leftResponse[2] + rightResponse[2]
            return [isSatisfied, coursesUsed, minCoursesLeft]
        case 'OR':
            leftResponse = isRequirementSatisfied(
              availableCourses,
              requirement["value"][0]
            );
            rightResponse = isRequirementSatisfied(
              availableCourses,
              requirement["value"][1]
            );

            isSatisfied = leftResponse[0] || rightResponse[0];
            minCoursesLeft = min(leftResponse[2], rightResponse[2]);
            coursesUsed = (leftResponse[2]==minCoursesLeft) ? leftResponse[1] : rightResponse[1]
            return [isSatisfied, coursesUsed, minCoursesLeft];
    }
}

function checkall(courses_taken : Array<String>){
    const course_list = () => JSON.parse(JSON.stringify(Concentration_req));
    const requirements : Object = course_list["CS"]["AB"];
    for (const key in requirements){
        isRequirementSatisfied(courses_taken, requirements[key]);
    }
}

// To compile: tsc .\validator.ts --resolveJsonModule --module nodenext
// to run node validator.js