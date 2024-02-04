import Nav from "@/components/Nav";
import { Box, Heading, Center } from "@chakra-ui/react";

export default function Home() {
  return (
    // <Center h="calc(100vh)">
    //     <Heading>Course Planner</Heading>
    // </Center>
    <Box maxW="5xl" m="auto">
        <Nav />
    </Box>
  )
}
