'use client'

import { Select } from "@chakra-ui/react"

export default function ClassSearch({ potentialClasses, onSelect }: any){
    return (
        <Select onChange={(e) => onSelect(e.target.value)} fontSize={'lg'} mb={2} placeholder='Select class'>
            { potentialClasses.map(({ code, title }: any, i: number) => <option value={code} key={i}>{code} - {title}</option>) }
        </Select>
    )
}