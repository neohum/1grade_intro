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

export default function Home() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

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
    <main className="min-h-screen bg-cmnbg flex flex-col p-6 md:p-10 overflow-hidden select-none">
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

                {/* Activity bubbles */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  {activities.map((activity, i) => {
                    const done = isActivityCompleted(selectedStudent.id, activity.id);
                    const isToggling = togglingId === activity.id;
                    return (
                      <motion.button
                        key={activity.id}
                        onClick={() => toggleActivity(selectedStudent.id, activity.id)}
                        disabled={isToggling}
                        className={`
                          relative px-5 py-3 rounded-2xl font-heading font-semibold text-base md:text-lg
                          shadow-lg backdrop-blur-sm cursor-pointer
                          transition-colors duration-200
                          ${done
                            ? 'bg-emerald-400/90 text-white shadow-emerald-200/50'
                            : 'bg-white/90 text-header shadow-white/30'
                          }
                          ${isToggling ? 'opacity-60' : 'hover:scale-105'}
                        `}
                        style={{
                          animation: `activityFloat 3s ease-in-out ${i * 0.4}s infinite`,
                        }}
                        initial={{ opacity: 0, scale: 0.5, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        transition={{
                          delay: 0.15 + i * 0.07,
                          type: 'spring',
                          stiffness: 400,
                          damping: 22,
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {done && (
                            <Check size={18} className="text-white" strokeWidth={3} />
                          )}
                          {activity.title}
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
