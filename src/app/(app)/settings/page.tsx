'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Student = {
    id: number;
    name: string;
};

type Activity = {
    id: number;
    title: string;
    iconUrl: string | null;
};

export default function SettingsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newStudentName, setNewStudentName] = useState('');
    const [newActivityTitle, setNewActivityTitle] = useState('');
    const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'done' | 'error'>('idle');
    const [buildMessage, setBuildMessage] = useState('');

    // Fetch initial data
    useEffect(() => {
        fetchStudents();
        fetchActivities();
    }, []);

    const fetchStudents = async () => {
        const res = await fetch('/api/students');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setStudents(data);
    };

    const fetchActivities = async () => {
        const res = await fetch('/api/activities');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setActivities(data);
    };

    const addStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentName.trim()) return;

        await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newStudentName }),
        });
        setNewStudentName('');
        fetchStudents();
    };

    const deleteStudent = async (id: number) => {
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        fetchStudents();
    };

    const addActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActivityTitle.trim()) return;

        await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newActivityTitle }),
        });
        setNewActivityTitle('');
        fetchActivities();
    };

    const deleteActivity = async (id: number) => {
        await fetch(`/api/activities/${id}`, { method: 'DELETE' });
        fetchActivities();
    };

    const resetTodayRecords = async () => {
        if (confirm('오늘의 모든 활동 기록을 초기화하시겠습니까?')) {
            await fetch('/api/records', { method: 'DELETE' });
            alert('초기화 되었습니다.');
        }
    };

    const downloadPackage = async () => {
        setBuildStatus('building');
        setBuildMessage('다운로드 확인 중...');
        try {
            const res = await fetch('/api/build-exe');
            if (!res.ok) {
                const data = await res.json();
                setBuildStatus('error');
                setBuildMessage(data.message || '빌드된 패키지가 없습니다.');
                return;
            }
            setBuildStatus('done');
            setBuildMessage('다운로드를 시작합니다...');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '1grade-app.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            setBuildStatus('error');
            setBuildMessage('다운로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-p5 text-white font-heading font-semibold rounded-full hover:bg-p1 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline">메인으로</span>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">선생님 설정 페이지</h1>
                            <p className="text-slate-500 mt-2">반 학생 명단과 기본 생활 습관 루틴을 관리하세요.</p>
                        </div>
                    </div>
                    <button
                        onClick={resetTodayRecords}
                        className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        오늘 기록 초기화
                    </button>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Students Section */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm mr-3">
                                {students.length}명
                            </span>
                            우리 반 학생 명단
                        </h2>

                        <form onSubmit={addStudent} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="학생 이름 입력"
                                className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                                disabled={!newStudentName.trim()}
                            >
                                <Plus size={24} />
                            </button>
                        </form>

                        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {students.map((student) => (
                                <li key={student.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                                    <span className="font-semibold text-slate-700">{student.name}</span>
                                    <button
                                        onClick={() => deleteStudent(student.id)}
                                        className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            ))}
                            {students.length === 0 && (
                                <div className="text-center py-8 text-slate-400">등록된 학생이 없습니다.</div>
                            )}
                        </ul>
                    </section>

                    {/* Activities Section */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-sm mr-3">
                                {activities.length}개
                            </span>
                            기본 생활 습관
                        </h2>

                        <form onSubmit={addActivity} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newActivityTitle}
                                onChange={(e) => setNewActivityTitle(e.target.value)}
                                placeholder="예: 알림장 내기, 우유 마시기"
                                className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                                disabled={!newActivityTitle.trim()}
                            >
                                <Plus size={24} />
                            </button>
                        </form>

                        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {activities.map((activity) => (
                                <li key={activity.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-slate-700">{activity.title}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteActivity(activity.id)}
                                        className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            ))}
                            {activities.length === 0 && (
                                <div className="text-center py-8 text-slate-400">등록된 활동이 없습니다.</div>
                            )}
                        </ul>
                    </section>
                </div>

                {/* Download Section */}
                <section className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-lg text-sm mr-3">
                            <Download size={14} className="inline -mt-0.5" />
                        </span>
                        독립 실행 패키지 다운로드
                    </h2>
                    <p className="text-slate-500 mb-4 text-sm">
                        이 앱을 독립 실행 패키지로 다운로드할 수 있습니다.
                        ZIP 파일을 압축 해제 후 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600">start.bat</code> (Windows)
                        또는 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600">start.sh</code> (Mac)을 실행하세요.
                    </p>
                    <p className="text-slate-400 mb-4 text-xs">
                        패키지가 없을 경우 터미널에서 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600">bun run build:standalone</code>을 먼저 실행하세요.
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={downloadPackage}
                            disabled={buildStatus === 'building'}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 text-white font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            {buildStatus === 'building' ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Download size={20} />
                            )}
                            {buildStatus === 'building' ? '확인 중...' : '다운로드'}
                        </button>
                        {buildMessage && (
                            <span className={`text-sm ${buildStatus === 'error' ? 'text-rose-500' : buildStatus === 'done' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                {buildMessage}
                            </span>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
