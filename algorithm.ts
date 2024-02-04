import Concentration_req from "./Concentration_req.json";
import allCourses from "./data/all_courses.json"
import {Requirement, isRequirementSatisfied} from "./front-end/src/utilities/validator"

type Semester = {
  semesterNum: number;
  courses: string[];
};

function getPicks(req: Requirement, courses_taken: string[]){
    let leftSide: Requirement, rightSide: Requirement;
    let remainingCourses: string[] = [];
    let remainingNum: number;
    switch (req.function) {
      case "PICK":
        let remainingNum = req.value as number;
        let reqCopies = req.courses!;
        const prevIndices: number[] = [];

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
          let num: number = Math.floor(Math.random() * reqCopies.length);

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
        } else {
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
        for (let j = 0; j < courses_taken.length; j++) {
          let department = courses_taken[j].split(" ")[0];
          let number = parseInt(courses_taken[j].split(" ")[1]);
          // @ts-ignore
          if (department == req.courses[0] && number >= 1000) {
            coursesUsed.push(courses_taken[j]);
            courses_taken.splice(j, 1);
            break;
          }
        }
        // if we got here, we have no more courses that can satisfy the requirement
        // @ts-ignore
        break;
    }
    console.log(remainingCourses);
    return remainingCourses;
}

export function getRemainingSemesters(
  coursesTaken: string[],
  semestersTaken: number,
  interestedSubjects: string[],
  concentration: string,
  type: string
): Semester[] {

  const semesterCourses: Semester[] = [];
  //   for (const key in concentrationReq) {
  //     //TODO: Making total coursesLeft list

  //     //coursesLeft.push(...[isRequirementSatisfied(courses_taken, requirement)[1]])

  //   }
  let requirements = Concentration_req["Concentrations"][concentration] as Requirement[];
  let coursesRemaining: string[] = [""];

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
  for(const req of requirements){
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
    } else if (aNumberInt > bNumberInt) {
      return 1;
    } else {
      return aPrefix.localeCompare(bPrefix);
    }
  });

  console.log("sorted courses:");
  console.log(sortedCourses);

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
