'use client'
import { Box, Heading } from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react'
import { FcIdea } from "react-icons/fc";
import { MdRocketLaunch } from "react-icons/md";


export default function Logo({  }){
    return (
        <Box display={'flex'} alignItems={'center'} justifyItems={"center"}>
            {/* <Box w="8" h="8" bg="blue.400" borderRadius={"md"} mr="2" /> */}
            <Icon as={FcIdea}  w={12} h={12} />
            <Heading fontSize={'5xl'}>Course Explorer</Heading>
            <Icon as={MdRocketLaunch} ml={2} w={12} h={12} />
        </Box>
    )
}