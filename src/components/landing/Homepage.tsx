"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Homepage = () => {
  const [isOn, setIsOn] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const handleClick = () => {
    if (isOn) return;
    setIsOn(true);
    setTimeout(() => {
      setShowFinal(true);
    }, 1000);
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${showFinal ? "bg-white" : "bg-black"}`}
    >
      <AnimatePresence>
        {!showFinal && (
          <motion.div
            initial={{ rotate: 0, y: -100 }}
            animate={
              !isOn
                ? {
                  rotate: [0, 10, -10, 10, -10, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  },
                }
                : { rotate: 0 }
            }
            exit={{
              y: -300,
              opacity: 0,
              transition: { duration: 1 },
            }}
            onClick={handleClick}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 cursor-pointer origin-top"
          >
            <Image
              src={isOn ? "/home/turnOn.png" : "/home/turnOff.png"}
              alt="Light Bulb"
              width={300}
              height={300}
              priority
            />
          </motion.div>
        )}

        {isOn && !showFinal && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 6, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-yellow-200 blur-3xl opacity-40"
          />
        )}
      </AnimatePresence>

      {showFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/home/background.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}

        >
          <div>
            <div className="p-4">
              <Image src="/home/logo.png" alt="Logo" width={40} height={50} />
            </div>

            <div className="flex flex-col justify-start h-full text-start px-24 mt-30 lg:mt-2">
              <p className="lg:text-[56px] text-[48px] text-white font-poppins">Trying to save your</p>
              <p className="text-[64px] text-white font-inter font-semibold">MONEY</p>
            </div>

            <div className="flex flex-col justify-end h-full text-end px-20 mt-10 lg:-mt-6">
              <p className="lg:text-[56px] text-[48px] text-white font-poppins">Starts with your</p>
              <p className="text-[64px] text-white font-inter font-semibold">Power Bill</p>
            </div>

            <div className="flex flex-col lg:flex-row justify-start items-start lg:justify-center lg:items-center h-full mx-auto gap-4 mt-20 lg:mt-5 px-20">
              <Image
                src="/home/Frugal.png"
                alt="Frugal"
                width={360}
                height={300}
              />
              <Image
                src="/home/Watt.png"
                alt="Watt"
                width={280}
                height={250}
                className="lg:mb-5"
              />
            </div>

            <div className="flex justify-center items-center">
              <button className="mt-30 lg:mt-2 bg-gradient-to-b from-[#384F1F] to-[#0b280a] text-white text-[14px] lg:text-[16px] rounded-sm font-semibold font-inter w-[360px] h-[48px]">
                Cut your bill now
              </button>
            </div>

            <p className="mt-4 text-sm text-white text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-400 text-center font-medium">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Homepage;
