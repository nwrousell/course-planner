'use client'

import { Box, Flex, Heading, Text } from "@chakra-ui/react"

export interface RequirementProgress {
    name: string
    // totalCourses: number
    coursesLeft: number
    satisfied: boolean
    coursesUsed: string[]
}

export default function RequirementsBox({ requirements, concentration }: { requirements: RequirementProgress[], concentration: string }) {

    return (
        <Box minW="sm" my={2} borderRadius={'md'} borderWidth={1} p={4} borderColor={'blue.100'} bg={'white'}>
            <Heading fontSize={'2xl'}>{concentration}</Heading>
            { requirements.map(({ name, coursesLeft, satisfied, coursesUsed }, i) => (
                <Flex key={i} p={1} mb={1} borderRadius={"md"} bg={satisfied ? 'green.50' : 'red.50'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={'xl'}>{name}</Text>
                    <Text fontSize={'lg'}>{ satisfied ? `${coursesUsed.length}/${coursesUsed.length}` : `${coursesLeft} left` }</Text>
                </Flex>
            )) }
        </Box>
    )
}