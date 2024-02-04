import Concentration_req from "./Concentration_req.json";
import allCourses from "./data/all_courses.json"
import {Requirement, isRequirementSatisfied} from "./front-end/src/utilities/validator"

type Semester = {
  semesterNum: number;
  courses: string[];
};

function getPicks(req: Requirement, missingVal: number){
    let leftSide: Requirement, rightSide: Requirement;
    switch (req.function) {
      case "PICK":
        const prevIndices: number[] = [];
        for (let k = 0; k < missingVal; k++) {
          let num: number = Math.random() * req.courses?.length!;
          while (prevIndices.includes(num)) {
            num = Math.random() * req.courses?.length!;
          }
          prevIndices.push(num);
        }
        break;
      case "OR":
        leftSide = req.value[0];
        const listVal1 = getPicks(leftSide, missingList[n]);

        rightSide = req.value[1];
        const listVal2 = getPicks(rightSide, missingList[n]);
        break;
      case "AND":
        leftSide = req.value[0];
        const listVal3 = getPicks(leftSide, missingList[n]);

        rightSide = req.value[1];
        const listVal4 = getPicks(rightSide, missingList[n]);
        break;
      case "ANY-ABOVE-1000":
        getPicks(req.value[0], missingList[n]);
        break;
    }
}

export function getRemainingSemesters(
  coursesTaken: string[],
  semestersTaken: number,
  interestedSubjects: string[],
  concentration: string,
  type: string
): Semester[] {

  const semesterCourses: Semester[] = [];
  const concentrationReq = (): Requirement =>
    JSON.parse(JSON.stringify(Concentration_req))[concentration][type];

  //   for (const key in concentrationReq) {
  //     //TODO: Making total coursesLeft list

  //     //coursesLeft.push(...[isRequirementSatisfied(courses_taken, requirement)[1]])

  //   }
  let requirements = Concentration_req["Concentrations"][concentration] as Requirement[];
  let coursesRemaining: string[] = [""];

  let missingList : number[] = [];
  for (const req of requirements) {
    const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(
      coursesTaken,
      req
    );
    missingList.push(coursesLeft)
  }

  console.log(missingList);

  let n = 0;
  for(const req of requirements){
    let leftSide: Requirement, rightSide: Requirement;
    switch(req.function){
        case "PICK":
            const prevIndices: number[] = [];
            for(let k = 0; k < missingList[n]; k++){
                let num: number = Math.random() * req.courses?.length!;
                while(prevIndices.includes(num)){
                    num = Math.random() * req.courses?.length!;
                }
                prevIndices.push(num);
            }
            break;
        case "OR":
            leftSide = req.value[0];
            const listVal1 = getPicks(leftSide, missingList[n]);

            rightSide = req.value[1];
            const listVal2 = getPicks(rightSide, missingList[n]);
            break;
        case "AND":
            leftSide = req.value[0];
            const listVal3 = getPicks(leftSide, missingList[n]);

            rightSide = req.value[1];
            const listVal4 = getPicks(rightSide, missingList[n]);
            break;
        case "ANY-ABOVE-1000":
            getPicks(req.value[0], missingList[n]);
            break;
    }
    n++;
  }

  const sortedCourses = coursesRemaining.sort((a, b) => {
    const [aPrefix, aNumber] = a.split(" ");
    const [bPrefix, bNumber] = b.split(" ");

    const aNumberInt = parseInt(aNumber);
    const bNumberInt = parseInt(bNumber);

    if (aNumberInt < bNumberInt) {
      return -1;
    } else if (aNumberInt > bNumberInt) {
      return 1;
    } else {
      return aPrefix.localeCompare(bPrefix);
    }
  });

  let pos = 0;
  const averageConcentrationCourses: number =
    sortedCourses.length / (8 - semestersTaken);

  while (coursesRemaining.length > 0) {
    const isSpring: Boolean = (semestersTaken + pos) % 2 === 1;
    let semesterNumber = semestersTaken + pos;
    const semester: Semester = {
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
          if (allCourses[sortedCourses[n]]["term"].split(" ")[0] === "Spring") {
            semester["courses"].push(coursesRemaining[n]);
            coursesRemaining.splice(n, 1);
          } else {
            n++;
          }
        } else {
          if (allCourses[sortedCourses[n]]["term"].split(" ")[0] === "Fall") {
            semester["courses"].push(coursesRemaining[n]);
            coursesRemaining.splice(n, 1);
          } else {
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

const concentration = "CS";
const type = "AB";
const semestersTaken = 0;
const coursesTaken = [];

console.log("test")
console.log(getRemainingSemesters(coursesTaken, 0, [], "N_CS", "AB"))
