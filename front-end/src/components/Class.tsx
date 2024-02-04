'use client'

import { Box, Text, Flex } from "@chakra-ui/react"
import { StarIcon } from "@chakra-ui/icons"

export interface ClassData {
    title: string
    code: string
    term: 'Fall' | 'Spring'
    critical_review_data: {
        average_hours: number
        max_hours: number
        course_rating: string
    }
    description: string
}

// Take in a Class object and show the 
export default function Class({ title, code, term, critical_review_data, description }: ClassData) {

    return (
        <Flex justifyContent={'space-between'} bg='white' mb={2} borderRadius={'md'} p={2} borderColor={'gray.200'} borderWidth={1} alignItems={'center'}>
            <Text fontSize={'xl'} fontWeight={'bold'}>{code}</Text>
            {
                (Object.keys(critical_review_data).length != 0) && <>
                    <Text fontSize={'lg'}>{critical_review_data.average_hours}-{critical_review_data.max_hours}hrs</Text>
                    <Flex alignItems={'center'}>
                        <Text>{critical_review_data.course_rating.split("\n")[1]}</Text>
                        <StarIcon color="blue.500" w={4} h={4} ml={1} />
                    </Flex>
                </>
            }
        </Flex>
    )
}