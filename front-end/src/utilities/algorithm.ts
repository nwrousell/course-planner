import Concentration_req from "../../public/data/Concentration_req.json";
import all_courses from "../../public/data/all_courses.json";
import { Requirement, isRequirementSatisfied } from "./validator";

type Semester = {
  semesterNum: number;
  courses: string[];
};

function getPicks(
  req: Requirement,
  courses_taken: string[],
  department: string
) {
  let leftSide: Requirement, rightSide: Requirement;
  let remainingCourses: string[] = [];
  let remainingNum: number;
  let reqCopies;
  switch (req.function) {
    case "PICK":
      remainingNum = req.value as number;
      reqCopies = req.courses;
      // console.log("Glehg:",reqCopies)
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
        //   console.log("NOW HERE", reqCopies[num])
        //@ts-ignore
        remainingCourses.push(reqCopies[num]);
      }
      break;
    case "OR":
      leftSide = req.value[0];
      const listVal1 = getPicks(leftSide, courses_taken, department);

      rightSide = req.value[1];
      const listVal2 = getPicks(rightSide, courses_taken, department);

      if (listVal1.length < listVal2.length) {
        return listVal1;
      } else {
        return listVal2;
      }
      break;
    case "AND":
      leftSide = req.value[0];
      const listVal3 = getPicks(leftSide, courses_taken, department);

      rightSide = req.value[1];
      const listVal4 = getPicks(rightSide, courses_taken, department);

      return listVal3.concat(listVal4);
      break;
    case "ANY-ABOVE-1000":
      let remainingCourses: string[] = [];
      remainingNum = req.value as number;
      let course_list: string[] = [];

      const above1000 = Object.keys(all_courses).filter(
        (v, i) =>
          v.split(" ")[0] == department && parseInt(v.split(" ")[1]) >= 1000
      );

      reqCopies = above1000.filter((course) => {
        if (courses_taken.includes(course)) {
          remainingNum--; // Decrement remainingNum for each course taken
          return false; // Exclude the course from the filtered array
        }
        return true; // Include the course in the filtered array
      });

      //console.log(reqCopies);
      const prevIndices2: number[] = [];
      for (let k = 0; k < remainingNum; k++) {
        let num: number = Math.floor(Math.random() * reqCopies.length);

        while (prevIndices2.includes(num)) {
          num = Math.floor(Math.random() * reqCopies.length);
        }
        prevIndices2.push(num);
        remainingCourses.push(reqCopies[num]);
      }
      //console.log("Electives: ", remainingCourses)
      // if we got here, we have no more courses that can satisfy the requirement
      return remainingCourses;
      // @ts-ignore
      break;
  }
  // console.log("test2");
  // console.log(remainingCourses);
  return remainingCourses;
}

export function getRemainingSemesters(
  coursesTaken: string[],
  semestersTaken: number,
  concentration: string
): Semester[] {
  const semesterCourses: Semester[] = [];
  let requirements = Concentration_req["Concentrations"][
    concentration
  ] as Requirement[];
  if (concentration == "APMA") requirements = requirements["AB"];
  let coursesRemaining: string[] = [];

  let department;
  if (concentration === "ECON") {
    department = "ECON";
  }

  if (concentration === "N_CS") {
    department = "CSCI";
  }

  if (concentration === "APMA") {
    department = "APMA";
  }

  let n = 0;
  for (const req of requirements) {
    const result = getPicks(req, coursesTaken, department);
    //console.log("HERE", result);
    coursesRemaining = coursesRemaining.concat(result);
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

  //   console.log("sorted courses:");
  //   console.log(sortedCourses);

  let pos = 0;
  const averageConcentrationCourses: number =
    sortedCourses.length / (8 - semestersTaken);

  // console.log(sortedCourses);

  while (sortedCourses.length > 0) {
    const isSpring: Boolean = (semestersTaken + pos) % 2 === 1;
    let semesterNumber = semestersTaken + pos;
    const semester: Semester = {
      semesterNum: semesterNumber,
      courses: [],
    };
    for (let i = 0; i < averageConcentrationCourses; i++) {
      if (sortedCourses.length === 0) {
        break;
      }
      let foundCourse: boolean = false;
      let n = 0;
      while (!foundCourse) {
        if (isSpring) {
          // console.log("data:", all_courses[sortedCourses[n]]);
          // console.log("search:", sortedCourses[n]);
          // console.log(sortedCourses, n);
          if (
            all_courses[sortedCourses[n]]["term"].split(" ")[0] === "Spring"
          ) {
            
            semester["courses"].push(sortedCourses.splice(n, 1)[0]);
            n--;
            console.log("test:", sortedCourses);
            foundCourse = true;
            break;
          } else {
            n++;
          }
        } else {
          // console.log(sortedCourses[n], all_courses[sortedCourses[n]])
          if (all_courses[sortedCourses[n]]["term"].split(" ")[0] === "Fall") {
            semester["courses"].push(sortedCourses.splice(n, 1)[0]);
            n--;
            console.log("test2:", sortedCourses);
            foundCourse = true;
            break;
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
    semesterCourses.push(semester);
    pos++;
  }
  return semesterCourses;
}

// const concentration = "CS";
// const type = "AB";
// const semestersTaken = 0;
// const coursesTaken = [];

// console.log("test")
// console.log(getRemainingSemesters(coursesTaken, 0, "N_CS"))
