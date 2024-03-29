'use client'
import Nav from "@/components/Nav";
import { Box, Heading, Center, Grid, SimpleGrid, Button, Select, Text, Checkbox, Stack } from "@chakra-ui/react";
import Class, { ClassData } from "@/components/Class";
import all_courses from '../../public/data/all_courses.json'
import Semester from "@/components/Semester";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import RequirementsBox, { RequirementProgress } from "@/components/RequirementsBox";
import Concentration_req from "../../public/data/Concentration_req.json"
import { Requirement, isRequirementSatisfied } from "@/utilities/validator";
import { getRemainingSemesters } from "@/utilities/algorithm";

export default function Home() {
    const [coursesBySemester, setCoursesBySemester] = useState<ClassData[][]>([[]])
    // const [concentration, setConcentration] = useState("ECON")
    const [econChecked, setEconChecked] = useState(true)
    const [csChecked, setCSChecked] = useState(false)
    const [apmaChecked, setAPMAChecked] = useState(false)


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

    const generateCoursePath = () => {
        const numSemesters = coursesBySemester.length
        const remainingSemesters = 8 - numSemesters
        const coursesTaken = combineListOfLists(coursesBySemester)
        const concentration = econChecked ? "ECON" : "N_CS"
        const newSemesters = getRemainingSemesters(coursesTaken, numSemesters, concentration)
        const newCourseCodes = newSemesters.map(({ courses }, i) => courses)
        const newCourses = newCourseCodes.map(( courses, i) => courses.map((code, j) => all_courses[code]))
        console.log("New Courses: ", newCourseCodes)
        setCoursesBySemester([...coursesBySemester, ...newCourses])
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
    
    const requirementProgressEcon: RequirementProgress[] = []
    for(const req of Concentration_req["Concentrations"]["ECON"]){
        //@ts-ignore
        const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(codesOfCoursesTaken, req)
        // console.log(`Requirement: ${req.name}, satisfied: ${satisfied}, coursesUsed: ${coursesUsed.join(", ")}, # coursesLeft: ${coursesLeft}`)
        requirementProgressEcon.push({
            satisfied, coursesLeft, name: req.name, coursesUsed
        })
    }
    const requirementProgressCS: RequirementProgress[] = []
    for(const req of Concentration_req["Concentrations"]["N_CS"]){
        //@ts-ignore
        const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(codesOfCoursesTaken, req)
        // console.log(`Requirement: ${req.name}, satisfied: ${satisfied}, coursesUsed: ${coursesUsed.join(", ")}, # coursesLeft: ${coursesLeft}`)
        requirementProgressCS.push({
            satisfied, coursesLeft, name: req.name, coursesUsed
        })
    }
    const requirementProgressAPMA: RequirementProgress[] = []
    for(const req of Concentration_req["Concentrations"]["APMA"]["AB"]){
        //@ts-ignore
        const [satisfied, coursesUsed, coursesLeft] = isRequirementSatisfied(codesOfCoursesTaken, req)
        // console.log(`Requirement: ${req.name}, satisfied: ${satisfied}, coursesUsed: ${coursesUsed.join(", ")}, # coursesLeft: ${coursesLeft}`)
        requirementProgressAPMA.push({
            satisfied, coursesLeft, name: req.name, coursesUsed
        })
    }
    
    return (
        <Box maxW="7xl" minH="calc(100vh)" m="auto">
            <Nav />
            <Box>
                {/* <Select display="inline-block" maxW="lg" placeholder="Select a concentration" onChange={(e) => setConcentration(e.target.value)}>
                    <option value="CS">CS</option>
                    <option value="ECON">ECON</option>
                    <option value="APMA">APMA</option>
                </Select> */}
                <Box p={4} borderRadius={'md'} borderWidth={1} borderColor={'gray.200'}>
                    <Stack spacing={5} direction='row'>
                        <Text fontSize={'lg'} fontWeight={'bold'}>Select your concentrations:</Text>
                        <Checkbox onChange={(e) => setCSChecked(e.target.checked)}>CS</Checkbox>
                        <Checkbox onChange={(e) => setEconChecked(e.target.checked)} defaultChecked>Econ</Checkbox>
                    </Stack>
                </Box>
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
                <Box position={"fixed"} right="8em" top="50%" transform={"translateY(-50%)"}>
                    { econChecked && <RequirementsBox concentration={"ECON"} requirements={requirementProgressEcon}/>}
                    { csChecked && <RequirementsBox concentration={"CS"} requirements={requirementProgressCS}/>}
                    { apmaChecked && <RequirementsBox concentration={"APMA"} requirements={requirementProgressAPMA}/>}
                </Box>
            </Box>
            <Text position={"absolute"} bottom="1em" transform={"translateX(-50%)"} color="gray.700" left={"50%"}>Made for Hack@Brown 2024 by Ryan Eng, Julian Beaudry, and Noah Rousell</Text>
            <Button onClick={generateCoursePath} colorScheme={"green"} position="fixed" right={'3em'} bottom={'3em'}>Generate possible course path</Button>
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