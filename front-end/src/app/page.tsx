'use client'
import Nav from "@/components/Nav";
import { Box, Heading, Center, Grid, SimpleGrid, Button, Select } from "@chakra-ui/react";
import Class, { ClassData } from "@/components/Class";
import all_courses from '../../public/data/all_courses.json'
import ClassSearch from "@/components/ClassSearch";
import Semester from "@/components/Semester";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import RequirementsBox from "@/components/RequirementsBox";
import Concentration_req from "../../public/data/Concentration_req.json"
import { Requirement, isRequirementSatisfied } from "@/utilities/validator";

export default function Home() {
    const [coursesBySemester, setCoursesBySemester] = useState<ClassData[][]>([[], []])
    const [concentration, setConcentration] = useState("CS")

    const onAddCourse = (code: string, i: number) => {
        let newSemester = [...coursesBySemester[i]]
        //@ts-ignore
        const newCourse = all_courses[code]
        newSemester.push(newCourse)
        const newSemesters = coursesBySemester.map((s, k) => (i==k) ? newSemester : s)

        setCoursesBySemester(newSemesters)
    }

    const addSemester = () => {
        setCoursesBySemester([...coursesBySemester, []])
    }

    // const course = all_courses["CSCI 0081"] as unknown as ClassData
    const codesOfCoursesTaken = combineListOfLists(coursesBySemester).map(({ code }, i) => code)
    const coursesNotTaken = Object.keys(all_courses).filter((code, i) => !codesOfCoursesTaken.includes(code))
    // @ts-ignore
    const potentialClasses = coursesNotTaken.map((code, i) => ({ code, title: all_courses[code].title }))
    // @ts-ignore
    const potentialFallClasses = potentialClasses.filter(({ code }, i) => all_courses[code].term.split(" ")[0]=="Fall")
    // @ts-ignore
    const potentialSpringClasses = potentialClasses.filter(({ code }, i) => all_courses[code].term.split(" ")[0]=="Spring")
    
    let requirements
    switch(concentration){
        case "CS":
            requirements = Concentration_req["Concentrations"]["CS"]["AB"] as Requirement[]
            break
        case "ECON":
            requirements = Concentration_req["Concentrations"]["ECON"] as Requirement[]
            break
        case "APMA":
            requirements = Concentration_req["Concentrations"]["APMA"]
    }
    for(const req of requirements){
        const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(codesOfCoursesTaken, req)
        console.log(`Requirement: ${req.name}, satisfied: ${satisfied}, coursesUsed: ${coursesUsed.join(", ")}, # coursesLeft: ${coursesLeft}`)
    }
    
    return (
        <Box maxW="7xl" m="auto">
            <Box maxW="5xl">
                <Nav />
            </Box>
            <Box>
                <Select onChange={(e) => setConcentration(e.target.value)}>
                    <option value="CS">CS</option>
                    <option value="ECON">ECON</option>
                    <option value="APMA">APMA</option>
                </Select>
                <SimpleGrid maxW="5xl" mt={32} columns={2} spacing={10}>
                    {/* <Class {...course} />
                    <ClassSearch potentialClasses={potentialClasses} /> */}
                    { coursesBySemester.map((courses, i) => (
                            <Semester 
                                potentialClasses={i%2==0 ? potentialFallClasses : potentialSpringClasses} 
                                number={i+1} 
                                term={i%2==0 ? "Fall" : "Spring"}
                                onCourseSelect={(c) => onAddCourse(c, i)} 
                                classes={courses} 
                                key={i}
                            />
                    )) }
                    { (coursesBySemester.length < 8) && <Button m="auto" leftIcon={<AddIcon w={4} h={4}/>} colorScheme="blue" title="Add Semester" onClick={addSemester}>Add Semester</Button>}
                </SimpleGrid>
                <Box>
                    <RequirementsBox />
                </Box>
            </Box>
        </Box>
    )
}

function combineListOfLists(list: any[][]){
    const newList: any[] = []
    for(const l of list){
        newList.push(...l)
    }
    return newList
}