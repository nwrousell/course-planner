'use client'
import { Box, Flex } from "@chakra-ui/react";
import Logo from "./Logo";
import { Link } from '@chakra-ui/next-js'

const NAV_LINKS = [
    { title: "About", link: "/about" }
]

export default function Nav({ }){
    return (
        <Flex mx={8} my={16} alignItems={"center"} justifyContent={"center"}>
            <Logo />
            {/* <Flex alignItems={"center"}>
                { NAV_LINKS.map((props, i) => <NavLink {...props} key={i} />) }
            </Flex> */}
        </Flex>
    )
}

function NavLink({ title, link }: { title: string, link: string }){
    return (
        <Link href={link} color='gray.700' fontSize={'xl'} _hover={{ color: 'blue.500' }}>
            { title }
        </Link>
    )
}