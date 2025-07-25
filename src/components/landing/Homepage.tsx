"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import 'aos/dist/aos.css';

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
        {!isOn && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[360px] left-1/2 -translate-x-1/2 text-white text-lg font-medium font-poppins z-10"
          >
            Tap the light
          </motion.p>
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
              <Image src="/home/logo-white.png" alt="Logo" width={40} height={50} />
            </div>

            <div className="flex flex-col justify-start lg:flex-row lg:justify-center items-center h-full mx-auto gap-5 mt-20 lg:mt-5 lg:px-20 px-10">
              <Image
                src="/home/Frugal.png"
                alt="Frugal"
                width={460}
                height={400}
              />
              <Image
                src="/home/Watt.png"
                alt="Watt"
                width={360}
                height={270}
                className="lg:mb-8"
              />
            </div>
            <div className="flex flex-col justify-start h-full text-start px-14 lg:px-64 mt-10 lg:mt-2">
              <p className="lg:text-[44px] text-[28px] text-white font-poppins z-10">Trying to save your</p>
              <p className="text-[48px] text-white font-inter font-semibold z-10 -mt-4">MONEY</p>
            </div>

            <div className="flex flex-col justify-start lg:justify-end lg:text-end h-full text-start px-14 lg:px-64 -mt-3 lg:-mt-12">
              <p className="lg:text-[44px] text-[28px] text-white font-poppins z-10">Starts with your</p>
              <p className="text-[48px] text-white font-inter font-semibold z-10 -mt-4">Power Bill</p>
            </div>

            <div className="flex justify-center items-center mt-14">
              <button className="z-10 lg:mt-6 bg-gradient-to-b from-[#384F1F] to-[#0b280a] text-white text-[14px] lg:text-[16px] rounded-sm font-semibold font-inter w-[360px] h-[48px]">
                <Link href="/login">Cut your bill now</Link>
              </button>
            </div>
            <div className="absolute bottom-0 z-0">
              <Image src="/home/hand.png" alt="hand" width={800} height={500} />
            </div>
            <motion.div
              initial={{ y: 0, opacity: 0.6 }}
              animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-3xl z-10"
            >
              <button>
                <Link href="/about">↓</Link>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Homepage;
