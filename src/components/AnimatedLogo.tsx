'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimationControls } from 'framer-motion';

const SPARKLE_COLORS = ['#F7941E', '#ED145B', '#73BE48', '#1CBBB4', '#827cd1', '#ff6e80', '#59d5ff', '#ffb25a'];

function Sparkle({ delay, color, x, y, size }: { delay: number; color: string; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${x}%`,
        top: `${y}%`,
        filter: `blur(${size > 6 ? 1 : 0}px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0],
        y: [0, -10, -20, -30],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: 'easeInOut',
      }}
    />
  );
}

function OrbitDot({ angle, radius, color, duration, size }: { angle: number; radius: number; color: string; duration: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
        filter: 'blur(0.5px)',
      }}
      animate={{
        x: [
          Math.cos((angle * Math.PI) / 180) * radius,
          Math.cos(((angle + 120) * Math.PI) / 180) * radius,
          Math.cos(((angle + 240) * Math.PI) / 180) * radius,
          Math.cos(((angle + 360) * Math.PI) / 180) * radius,
        ],
        y: [
          Math.sin((angle * Math.PI) / 180) * radius,
          Math.sin(((angle + 120) * Math.PI) / 180) * radius,
          Math.sin(((angle + 240) * Math.PI) / 180) * radius,
          Math.sin(((angle + 360) * Math.PI) / 180) * radius,
        ],
        opacity: [0.6, 1, 0.6, 0.6],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function AnimatedLogo({ size = 'md' }: { size?: 'md' | 'lg' } = {}) {
  const isLarge = size === 'lg';
  const controls = useAnimationControls();
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      // Bounce in with overshoot
      await controls.start({
        scale: [0, 1.3, 0.9, 1.1, 1],
        rotate: [0, -15, 10, -5, 0],
        opacity: 1,
        transition: { duration: 1, ease: 'easeOut' },
      });
      setHasEntered(true);
    };
    sequence();
  }, [controls]);

  const sparkles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow pulse behind logo */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: isLarge ? 400 : 90,
          height: isLarge ? 400 : 90,
          background: 'radial-gradient(circle, rgba(28,187,180,0.35) 0%, rgba(247,148,30,0.15) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary glow ring */}
      <motion.div
        className="absolute rounded-full border-2 pointer-events-none"
        style={{
          width: isLarge ? 360 : 80,
          height: isLarge ? 360 : 80,
          borderColor: 'rgba(247,148,30,0.2)',
        }}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Orbiting dots */}
      <OrbitDot angle={0} radius={isLarge ? 200 : 45} color="#F7941E" duration={6} size={isLarge ? 12 : 5} />
      <OrbitDot angle={120} radius={isLarge ? 200 : 45} color="#ED145B" duration={6} size={isLarge ? 10 : 4} />
      <OrbitDot angle={240} radius={isLarge ? 200 : 45} color="#1CBBB4" duration={6} size={isLarge ? 12 : 5} />
      <OrbitDot angle={60} radius={isLarge ? 240 : 55} color="#73BE48" duration={8} size={isLarge ? 8 : 3} />
      <OrbitDot angle={180} radius={isLarge ? 240 : 55} color="#827cd1" duration={8} size={isLarge ? 10 : 4} />

      {/* Sparkles */}
      {sparkles.map((s) => (
        <Sparkle key={s.id} delay={s.delay} color={s.color} x={s.x} y={s.y} size={s.size} />
      ))}

      {/* Main logo with float + wobble */}
      <motion.div
        className="relative z-10 cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={controls}
        whileHover={{
          scale: 1.15,
          rotate: [0, -8, 8, -4, 0],
          transition: { duration: 0.6 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Continuous float */}
        <motion.div
          animate={
            hasEntered
              ? {
                  y: [0, -6, 0, -3, 0],
                  rotate: [0, 2, 0, -2, 0],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image
            src="/logo.svg"
            alt="스스로 척척"
            width={isLarge ? 320 : 64}
            height={isLarge ? 320 : 64}
            className={isLarge ? 'w-64 h-64 md:w-80 md:h-80 drop-shadow-xl' : 'w-14 h-14 md:w-16 md:h-16 drop-shadow-lg'}
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
