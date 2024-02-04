import { Box, Heading } from "@chakra-ui/react";

export default function Logo({  }){
    return (
        <Box display={'flex'} alignItems={'center'} justifyContent={"center"}>
            <Box w="8" h="8" bg="blue.400" borderRadius={"md"} mr="2" />
            <Heading>Course Planner</Heading>
        </Box>
    )
}