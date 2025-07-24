"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const HeroAnimation = () => {
  const [isOn, setIsOn] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const handleClick = () => {
    if (isOn) return; 
    setIsOn(true);
    setTimeout(() => {
      setShowFinal(true);
    }, 1500);
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${
        showFinal ? "bg-white" : "bg-black"
      }`}
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
              src={isOn ? "/hero/turnOn.png" : "/hero/turnOff.png"}
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
          className="absolute inset-0 flex items-center justify-center bg-white text-black text-3xl font-bold"
        >
          Welcome to the Light
        </motion.div>
      )}
    </div>
  );
};

export default HeroAnimation;
