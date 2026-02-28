'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Check, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import PhysicsStudentCards from '@/components/PhysicsStudentCards';
import AnimatedLogo from '@/components/AnimatedLogo';
import { playBubblePop, playComplete, playUndo } from '@/lib/sounds';

type Student = {
  id: number;
  name: string;
};

type Activity = {
  id: number;
  title: string;
  iconUrl: string | null;
};

type Record = {
  id: number;
  studentId: number;
  activityId: number;
  completed: boolean;
};

// 12 distinct cloud shapes — fluffy, wide, tall, wispy varieties
const CLOUD_PATHS = [
  // Fluffy round
  'M170,95 C200,95 200,65 185,55 C195,30 170,20 150,30 C140,8 110,5 90,20 C70,2 45,10 40,35 C15,30 5,50 15,70 C5,90 25,95 40,95 Z',
  // Wide & flat
  'M180,88 C205,88 200,60 185,52 C190,35 170,28 155,38 C148,18 120,12 100,25 C82,10 55,15 48,35 C25,28 8,45 18,65 C8,82 25,88 45,88 Z',
  // Tall & puffy
  'M165,98 C195,98 198,72 182,58 C192,35 168,15 145,28 C135,5 105,0 85,18 C65,0 38,12 35,38 C10,32 0,55 15,75 C2,95 22,98 42,98 Z',
  // Wispy stretched
  'M185,90 C210,88 205,58 188,48 C195,28 172,18 152,30 C145,12 118,8 98,22 C78,8 50,14 42,34 C18,28 2,48 14,68 C2,85 20,92 48,90 Z',
  // Bumpy top
  'M168,92 C196,92 194,68 180,56 C188,38 170,22 148,32 C140,10 112,2 88,16 C68,0 42,8 36,32 C14,24 0,46 12,68 C0,88 18,94 38,92 Z',
  // Soft oval
  'M175,94 C202,92 198,62 184,50 C190,30 165,16 142,28 C132,6 100,0 82,18 C60,4 35,16 32,40 C8,36 -2,58 12,76 C4,94 28,96 50,94 Z',
  // Compact & dense
  'M160,90 C188,92 190,66 178,55 C186,38 168,24 150,34 C142,15 118,10 100,24 C82,12 60,18 52,38 C30,32 18,50 26,68 C16,86 32,92 50,90 Z',
  // Asymmetric left-heavy
  'M172,96 C200,94 196,66 180,54 C188,32 164,14 140,26 C128,4 96,0 78,18 C56,6 30,18 28,44 C4,40 -4,62 14,80 C6,96 30,98 55,96 Z',
  // Asymmetric right-heavy
  'M182,92 C212,90 206,58 190,46 C198,24 175,12 155,26 C146,10 122,6 104,20 C86,8 64,16 58,36 C38,30 24,48 32,66 C22,86 40,92 60,92 Z',
  // Triple-bump crown
  'M170,94 C198,94 200,70 186,58 C196,40 178,26 158,34 C152,14 130,4 110,16 C92,0 65,6 55,26 C35,14 15,28 18,52 C4,60 2,80 18,90 C8,96 30,96 48,94 Z',
  // Flat bottom wide
  'M188,88 C215,86 208,55 192,44 C200,22 176,10 155,24 C145,6 115,0 92,16 C70,2 42,12 36,36 C10,30 -2,52 12,72 C2,86 24,90 52,88 Z',
  // Small & cute
  'M158,90 C182,92 184,68 172,58 C180,42 166,30 150,38 C144,22 126,16 112,26 C98,16 80,22 74,40 C56,36 46,50 52,66 C42,84 56,92 72,90 Z',
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function Home() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, activitiesRes, recordsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/activities'),
        fetch('/api/records'),
      ]);

      if (!studentsRes.ok || !activitiesRes.ok || !recordsRes.ok) return;

      const [studentsData, activitiesData, recordsData] = await Promise.all([
        studentsRes.json(),
        activitiesRes.json(),
        recordsRes.json(),
      ]);

      if (Array.isArray(studentsData))
        setStudents(prev => JSON.stringify(prev) === JSON.stringify(studentsData) ? prev : studentsData);
      if (Array.isArray(activitiesData))
        setActivities(prev => JSON.stringify(prev) === JSON.stringify(activitiesData) ? prev : activitiesData);
      if (Array.isArray(recordsData))
        setRecords(prev => JSON.stringify(prev) === JSON.stringify(recordsData) ? prev : recordsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getStudentProgress = useCallback((studentId: number) => {
    if (activities.length === 0) return 0;
    const completedCount = records.filter(
      r => r.studentId === studentId && r.completed
    ).length;
    return completedCount / activities.length;
  }, [activities, records]);

  const isActivityCompleted = (studentId: number, activityId: number) => {
    return records.some(
      r => r.studentId === studentId && r.activityId === activityId && r.completed
    );
  };

  const toggleActivity = async (studentId: number, activityId: number) => {
    if (togglingId !== null) return;
    setTogglingId(activityId);
    const currentlyCompleted = isActivityCompleted(studentId, activityId);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          activityId,
          completed: !currentlyCompleted,
        }),
      });
      if (res.ok) {
        if (currentlyCompleted) playUndo(); else playComplete();
        const updatedRecord = await res.json();
        setRecords(prev => {
          const existing = prev.findIndex(
            r => r.studentId === studentId && r.activityId === activityId
          );
          if (existing >= 0) {
            const next = [...prev];
            next[existing] = updatedRecord;
            return next;
          }
          return [...prev, updatedRecord];
        });
      }
    } catch (error) {
      console.error('Failed to toggle activity:', error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-cmnbg flex flex-col p-6 md:p-10 overflow-hidden select-none relative">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cmnbg"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* Background decorative circles */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(28,187,180,0.12) 0%, rgba(247,148,30,0.06) 40%, transparent 70%)',
              }}
              animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(237,20,91,0.08) 0%, rgba(115,190,72,0.05) 50%, transparent 70%)',
              }}
              animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            {/* Floating confetti dots */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 6 + (i % 4) * 3,
                  height: 6 + (i % 4) * 3,
                  backgroundColor: ['#F7941E', '#ED145B', '#73BE48', '#1CBBB4', '#827cd1', '#ff6e80', '#59d5ff', '#ffb25a'][i % 8],
                  left: `${10 + (i * 4.3) % 80}%`,
                  top: `${5 + (i * 5.7) % 90}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.7, 0.7, 0],
                  scale: [0, 1, 1, 0],
                  y: [0, -20 - (i % 3) * 10, -40 - (i % 3) * 15, -60],
                }}
                transition={{
                  duration: 3,
                  delay: 0.5 + i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <AnimatedLogo size="lg" />
            </motion.div>

            {/* Title */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-accent"
                animate={{
                  color: ['#F7941E', '#ED145B', '#1CBBB4', '#73BE48', '#F7941E'],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                스스로 척척!
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl font-heading font-bold text-header/70 mt-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                등교 루틴
              </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="mt-10 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-p5"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3 md:gap-5">
          <AnimatedLogo />
          <div className="flex flex-col">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-header flex items-center gap-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.span
                className="font-accent text-p2"
                animate={{
                  color: ['#F7941E', '#ED145B', '#1CBBB4', '#73BE48', '#F7941E'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                스스로 척척!
              </motion.span>
            </motion.h1>
            <motion.span
              className="text-lg md:text-xl lg:text-2xl font-heading text-header/70 -mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              등교 루틴
            </motion.span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {session.user.name && (
                <span className="hidden sm:inline text-sm font-heading font-semibold text-header">
                  {session.user.name} 선생님
                </span>
              )}
              <Link
                href="/settings"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-header font-heading font-semibold rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <Settings size={20} className="text-p5" />
                <span className="hidden sm:inline">설정</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-header font-heading font-semibold rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <LogOut size={18} className="text-p3" />
                <span className="hidden sm:inline text-sm">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-p5 text-white font-heading font-semibold rounded-full shadow-sm hover:opacity-90 transition-opacity"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-header font-heading font-semibold rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Balloon Board */}
      <div className="flex-1 relative w-full h-full flex flex-col pb-4">
        {students.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <AnimatedLogo size="lg" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-header/60">
                <span className="font-accent text-p2/60">스스로 척척!</span> 등교 루틴
              </p>
              <p className="text-text-body mt-2">
                {session?.user
                  ? '설정에서 학생과 활동을 추가해보세요!'
                  : '로그인하여 시작하세요!'
                }
              </p>
            </div>
          </div>
        ) : (
          <PhysicsStudentCards
            students={students}
            getStudentProgress={getStudentProgress}
            onSelectStudent={(s) => { playBubblePop(); setSelectedStudent(s); }}
          />
        )}

        {/* Floating Activity Cards Overlay */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/20 rounded-3xl"
                onClick={() => setSelectedStudent(null)}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg w-full px-4">
                {/* Student name + close */}
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white drop-shadow-lg">
                    {selectedStudent.name}
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="ml-2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </motion.div>

                {/* Activity clouds — layered rows drifting left/right */}
                <div className="relative w-full" style={{ height: Math.max(320, Math.ceil(activities.length / 3) * 130 + 40) }}>
                  {activities.map((activity, i) => {
                    const done = isActivityCompleted(selectedStudent.id, activity.id);
                    const isToggling = togglingId === activity.id;
                    const cloudPath = CLOUD_PATHS[i % CLOUD_PATHS.length];

                    // Layer layout: 3 columns, rows stacked
                    const cols = Math.min(activities.length, 3);
                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    const cellW = 100 / cols;
                    const baseLeft = cellW * col + cellW / 2;
                    const baseTop = row * 130 + 10;
                    const offsetX = (seededRandom(i * 7 + 3) - 0.5) * (cellW * 0.3);
                    const offsetY = (seededRandom(i * 13 + 5) - 0.5) * 20;

                    // Layer-based drift: odd rows go right, even rows go left
                    const driftAnim = row % 2 === 0 ? 'cloudDriftRight' : 'cloudDriftLeft';
                    // Vary speed per layer: top rows faster, bottom slower
                    const driftSpeed = 6 + row * 2 + seededRandom(i * 11) * 2;
                    // Vary scale per layer: back rows slightly smaller
                    const layerScale = 1 - row * 0.05;

                    const cw = 180 * layerScale;
                    const ch = 120 * layerScale;

                    return (
                      <motion.button
                        key={activity.id}
                        onClick={() => toggleActivity(selectedStudent.id, activity.id)}
                        disabled={isToggling}
                        className={`absolute cursor-pointer ${isToggling ? 'opacity-60' : 'hover:scale-110'} transition-transform`}
                        style={{
                          animation: `${driftAnim} ${driftSpeed}s ease-in-out ${seededRandom(i * 3) * 2}s infinite`,
                          width: cw,
                          height: ch + 14,
                          left: `calc(${baseLeft + offsetX}% - ${cw / 2}px)`,
                          top: baseTop + offsetY,
                          zIndex: 10 - row,
                        }}
                        initial={{ opacity: 0, scale: 0.3, x: row % 2 === 0 ? -60 : 60 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.3, x: row % 2 === 0 ? 60 : -60 }}
                        transition={{
                          delay: 0.1 + i * 0.08,
                          type: 'spring',
                          stiffness: 300,
                          damping: 22,
                        }}
                      >
                        {/* Floor shadow */}
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: '15%',
                            right: '15%',
                            bottom: 0,
                            height: 14,
                            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)',
                            borderRadius: '50%',
                          }}
                        />
                        {/* Cloud SVG */}
                        <svg
                          viewBox="0 0 220 100"
                          className="absolute w-full"
                          style={{
                            top: 0,
                            height: ch,
                            filter: done ? 'drop-shadow(0 6px 14px rgba(52,211,153,0.45))' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))',
                          }}
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id={`cg-${activity.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={done ? '#6ee7b7' : '#ffffff'} />
                              <stop offset="60%" stopColor={done ? '#34d399' : '#f1f5f9'} />
                              <stop offset="100%" stopColor={done ? '#10b981' : '#dde4ed'} />
                            </linearGradient>
                            <linearGradient id={`ch-${activity.id}`} x1="0.3" y1="0" x2="0.5" y2="0.7">
                              <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                              <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <radialGradient id={`cs-${activity.id}`} cx="0.5" cy="1" r="0.6">
                              <stop offset="0%" stopColor={done ? 'rgba(6,78,59,0.12)' : 'rgba(0,0,0,0.06)'} />
                              <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                            <clipPath id={`cc-${activity.id}`}>
                              <path d={cloudPath} />
                            </clipPath>
                          </defs>
                          {/* Base gradient fill */}
                          <path d={cloudPath} fill={`url(#cg-${activity.id})`} />
                          {/* Bottom inner shadow */}
                          <rect x="0" y="50" width="220" height="50" fill={`url(#cs-${activity.id})`} clipPath={`url(#cc-${activity.id})`} />
                          {/* Top highlight shine */}
                          <ellipse cx="105" cy="25" rx="65" ry="24" fill={`url(#ch-${activity.id})`} clipPath={`url(#cc-${activity.id})`} />
                          {/* Subtle border */}
                          <path d={cloudPath} fill="none" stroke={done ? 'rgba(6,78,59,0.08)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                        </svg>
                        {/* Text — constrained to cloud inner area */}
                        <span
                          className={`absolute flex items-end justify-center font-heading font-bold leading-tight text-center ${done ? 'text-white' : 'text-header'}`}
                          style={{
                            top: ch * 0.3,
                            left: cw * 0.12,
                            right: cw * 0.12,
                            height: ch * 0.55,
                            paddingBottom: ch * 0.05,
                            fontSize: Math.max(11, 14 * layerScale),
                            overflow: 'hidden',
                            textShadow: done ? '0 1px 2px rgba(0,0,0,0.15)' : 'none',
                          }}
                        >
                          <span className="flex items-center gap-1">
                            {done && <Check size={14} className="text-white flex-shrink-0" strokeWidth={3} />}
                            {activity.title}
                          </span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
    </main>
  );
}
