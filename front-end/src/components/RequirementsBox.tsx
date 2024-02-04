'use client'

import { Box } from "@chakra-ui/react"

interface RequirementProgress {
    name: string
    
}

export default function RequirementsBox({ requirements }: { requirements: RequirementProgress[] }) {

    return (
        <Box borderRadius={'md'} borderWidth={1} p={4} borderColor={'blue.100'} bg={'blue.50'}>
            
        </Box>
    )
}