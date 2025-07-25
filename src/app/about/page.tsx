"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const About = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = 78;
        const speed = 10;

        const counter = setInterval(() => {
            start += 1;
            if (start > end) {
                clearInterval(counter);
            } else {
                setCount(start);
            }
        }, speed);

        return () => clearInterval(counter);
    }, []);

    return (
        <div className="relative w-full min-h-screen flex flex-col justify-center items-center gap-10 px-4 text-center mt-12">
            <div className="absolute w-[250px] h-[250px] bg-green-500 rounded-full blur-3xl opacity-30 z-0 top-1 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-center">
                <p className="text-5xl lg:text-8xl font-semibold">Why</p>
                <div className="flex flex-row">
                    <p className="text-5xl lg:text-8xl text-green-500 font-semibold">FrugalWatt</p>
                    <p className="text-5xl lg:text-8xl font-semibold">?</p>
                </div>
            </div>

            <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
                <div className="text-6xl font-bold">{count}%</div>
                <div className="text-md lg:text-xl font-semibold">
                    of people agree to buy Energy-Saving Products because they can save more costs
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-4 w-full lg:max-w-6xl z-10">
                <Card className="relative bg-white text-black rounded-xl lg:px-6 lg:py-8 px-2 py-4 transition-transform duration-300 ">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-green-800 rounded-xl translate-x-2 translate-y-2 -z-10" />
                    <div className="flex flex-col items-start gap-4">
                        <div className="font-bold -mt-2 text-start">Electricity Are Mostly Understood in Terms of Bills</div>
                        <p className="text-gray-700 -mt-2 text-start">Homeowners often overestimate appliance usage and focus on using them less instead of switching to energy-efficient ones.</p>
                    </div>
                </Card>
                <Card className="relative bg-white text-black rounded-xl lg:px-6 lg:py-8 px-2 py-4 transition-transform duration-300 ">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-green-800 rounded-xl translate-x-2 translate-y-2 -z-10" />
                    <div className="flex flex-col items-start gap-4">
                        <div className="font-bold -mt-2 text-start">Hidden Fees Are Overlooked</div>
                        <p className="text-gray-700 -mt-2 text-start">Most consumers focuses on the price tags and habits but not the ongoing costs of the appliances.</p>
                    </div>
                </Card>
                <Card className="relative bg-white text-black rounded-xl lg:px-6 lg:py-8 px-2 py-4  transition-transform duration-300 ">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-green-800 rounded-xl translate-x-2 translate-y-2 -z-10" />
                    <div className="flex flex-col items-start gap-4">
                        <div className="font-bold -mt-2 text-start">Electricity Are Mostly Understood in Terms of Bills</div>
                        <p className="text-gray-700 -mt-2 text-start">The Indonesian goverment doesn’t provide subsidies for energy-efficient appliances. But, they use a Energy Saving Label Mark to identify appliances that met with government’s standard.</p>
                    </div>
                </Card>
            </div>
            <br></br>
            <br></br>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                <p className="text-5xl lg:text-8xl font-semibold">What</p>
                <p className="text-5xl lg:text-8xl text-green-500 font-semibold">FrugalWatt</p>
                <p className="text-5xl lg:text-8xl font-semibold">does?</p>
            </div>
            <div className="flex flex-row gap-4 items-center justify-center max-w-sm lg:max-w-3xl -mt-2">
                <p className="text-sm p-6"><span className="text-green-500">FrugalWatt</span> is an application that focuses on the breaking down of the appliances' information such as <span className="text-green-500">voltage, current, and power consumption</span> which can help users be more <span className="text-green-500">conscious</span> about what appliances they use and pointing out ongoing costs of the appliances.</p>
            </div>
            <div>
                <Image 
                    src="/home/houseappliances.png"
                    alt="house-appliances"
                    width={700}
                    height={400}
                />
                <div className="absolute w-[500px] h-[250px] bg-gray-500 rounded-full blur-3xl opacity-30 z-0 bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="flex justify-center items-center mb-3">
              <button className="z-10 bg-green-700 text-white text-[14px] lg:text-[16px] rounded-sm font-semibold font-inter lg:w-[360px] lg:h-[48px] w-[200px] h-[32px]">
                <Link href="/dashboard" className="text-[12px] lg:text-md">Check your appliances now</Link>
              </button>
            </div>
        </div>
    );
}

export default About;
