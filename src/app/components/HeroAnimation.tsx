'use-client'
import React, { JSX, useState } from "react"
import Image from "next/image";

export default function HeroAnimation(): JSX.Element{
    const [isOn, setIsOn] = useState<boolean>(false)
    const [isFinal, setIsFinal] = useState<boolean>(false)

    const handleClick = () => {
        setIsOn(true)
        setTimeout(() => {
            setIsFinal(true)
        }, 1500)
    }

    return(
        <div className="relative w-full h-screen ">
            
        </div>
    );
}