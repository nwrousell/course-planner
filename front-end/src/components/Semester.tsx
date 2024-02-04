'use client'
import { Box, Flex, Text } from "@chakra-ui/react";
import Class, { ClassData } from "./Class";
import ClassSearch from "./ClassSearch";

export default function Semester({ number, term, classes, potentialClasses, onCourseSelect }: { number: number, term: 'Fall' | 'Spring', classes: ClassData[], potentialClasses: any, onCourseSelect: (code: string) => void }) {

    const showClassSearch = classes.length < 5
    return (
        <Box p={4} bg={'blue.50'} borderRadius={'md'} borderWidth={1} borderColor={'blue.100'}>
            <Flex mb={2} alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize={"lg"}>Semester: {number}</Text>
                <Text fontSize={"lg"}>{term}</Text>
            </Flex>
            {classes.map((classData: ClassData, i) => <Class {...classData} key={i} />)}

            {showClassSearch && <ClassSearch
                        onSelect={onCourseSelect}
                        potentialClasses={potentialClasses}
                    />}
        </Box>
    )
} 