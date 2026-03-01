'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Sparkles } from 'lucide-react';

type Student = { id: number; name: string };
type BodyPos = { x: number; y: number; vx: number; vy: number };
type StringPt = { x: number; y: number };

// 12 diverse balloon colors
const BALLOON_COLORS = [
  { fill: '#FF6B6B', shade: '#D94F4F' },
  { fill: '#F7941E', shade: '#D07A12' },
  { fill: '#73BE48', shade: '#5A9B35' },
  { fill: '#1CBBB4', shade: '#0D9E98' },
  { fill: '#ED145B', shade: '#C40E4B' },
  { fill: '#5B86E5', shade: '#3D6BC7' },
  { fill: '#FF9FF3', shade: '#D880CC' },
  { fill: '#FECA57', shade: '#D4A83E' },
  { fill: '#A29BFE', shade: '#7F78DB' },
  { fill: '#00CEC9', shade: '#00A8A3' },
  { fill: '#E17055', shade: '#C05A42' },
  { fill: '#6C5CE7', shade: '#5441C7' },
];
const DONE_COLOR = { fill: '#FFD700', shade: '#C8A800' };
const STRING_COLOR = '#B8CDD8';

// SVG viewBox = 512×512
const SVG_SIZE = 130;
const VB = 512;
const SC = SVG_SIZE / VB;
const BCX = Math.round(280 * SC);
const BCY = Math.round(165 * SC);
const TCY = Math.round(130 * SC);
const PHYS_R = 36;
const WALL_T = 50;

// String attachment: knot position in viewBox ≈ (284, 400)
const KNOT_DX = Math.round(284 * SC) - BCX;
const KNOT_DY = Math.round(400 * SC) - BCY;
const STRING_LEN = 70;
const NUM_STRING_SEGS = 4;
const SEG_LEN = STRING_LEN / NUM_STRING_SEGS;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function PhysicsStudentCards({
  students,
  getStudentProgress,
  onSelectStudent,
}: {
  students: Student[];
  getStudentProgress: (id: number) => number;
  onSelectStudent?: (student: Student) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<number, Matter.Body>>(new Map());
  const runnerRef = useRef<Matter.Runner | null>(null);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const stringPointsRef = useRef<Map<number, StringPt[]>>(new Map());
  const clickInfoRef = useRef<{ x: number; y: number; label: string } | null>(null);
  const onSelectRef = useRef(onSelectStudent);
  onSelectRef.current = onSelectStudent;
  const progressRef = useRef(getStudentProgress);
  progressRef.current = getStudentProgress;
  const [positions, setPositions] = useState<Map<number, BodyPos>>(new Map());

  const sync = useCallback(() => {
    const t = performance.now() * 0.001;
    timeRef.current = t;

    const m = new Map<number, BodyPos>();
    bodiesRef.current.forEach((b, id) => {
      m.set(id, {
        x: b.position.x,
        y: b.position.y,
        vx: b.velocity.x,
        vy: b.velocity.y,
      });

      // --- String segment physics ---
      const kx = b.position.x + KNOT_DX;
      const ky = b.position.y + KNOT_DY;

      if (!stringPointsRef.current.has(id)) {
        const pts: StringPt[] = [];
        for (let j = 0; j < NUM_STRING_SEGS; j++) {
          pts.push({ x: kx, y: ky + SEG_LEN * (j + 1) });
        }
        stringPointsRef.current.set(id, pts);
      }

      const pts = stringPointsRef.current.get(id)!;
      for (let j = 0; j < NUM_STRING_SEGS; j++) {
        const parent = j === 0 ? { x: kx, y: ky } : pts[j - 1];
        const pt = pts[j];

        // Each lower segment follows its parent with more lag
        const follow = 0.12 - j * 0.02;
        pt.x += (parent.x - pt.x) * follow;
        pt.y += (parent.y + SEG_LEN - pt.y) * (follow + 0.03);

        // Tiny idle sway per segment
        pt.x += Math.sin(t * (1.8 - j * 0.35) + id * 2.5 + j * 1.1) * 0.2;

        // Constrain max distance from parent
        const dx = pt.x - parent.x;
        const dy = pt.y - parent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = SEG_LEN * 1.5;
        if (dist > maxDist) {
          const scale = maxDist / dist;
          pt.x = parent.x + dx * scale;
          pt.y = parent.y + dy * scale;
        }
      }
    });

    setPositions(m);
    rafRef.current = requestAnimationFrame(sync);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || students.length === 0) return;

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

    const cw = el.clientWidth;
    const ch = el.clientHeight;

    if (!engineRef.current) {
      engineRef.current = Engine.create({ gravity: { x: 0, y: 0 } });
    }
    const engine = engineRef.current;

    Composite.clear(engine.world, false);
    bodiesRef.current.clear();
    stringPointsRef.current.clear();

    // Walls – high restitution for bouncy collisions
    const walls = [
      Bodies.rectangle(cw / 2, ch + WALL_T / 2, cw * 2, WALL_T, { isStatic: true, restitution: 0.9 }),
      Bodies.rectangle(-WALL_T / 2, ch / 2, WALL_T, ch * 2, { isStatic: true, restitution: 0.9 }),
      Bodies.rectangle(cw + WALL_T / 2, ch / 2, WALL_T, ch * 2, { isStatic: true, restitution: 0.9 }),
      Bodies.rectangle(cw / 2, -WALL_T / 2, cw * 2, WALL_T, { isStatic: true, restitution: 0.9 }),
    ];
    Composite.add(engine.world, walls);

    // Random initial positions near the bottom
    const margin = PHYS_R + 20;
    students.forEach((s, i) => {
      const x = margin + ((i * 0.618) % 1) * (cw - margin * 2) + (Math.random() - 0.5) * 60;
      const y = ch - 120 - PHYS_R + (Math.random() - 0.5) * 50;
      const body = Bodies.circle(
        clamp(x, margin, cw - margin),
        clamp(y, margin, ch - margin),
        PHYS_R,
        {
          restitution: 0.85,
          friction: 0.01,
          frictionAir: 0.025,
          density: 0.001,
          label: `s-${s.id}`,
        },
      );
      Body.setInertia(body, Infinity);
      bodiesRef.current.set(s.id, body);
      Composite.add(engine.world, body);
    });

    // Per-balloon floating forces — balloons rise as activities are completed
    const beforeUpdateHandler = () => {
      const t = engine.timing.timestamp * 0.001;
      bodiesRef.current.forEach((body, id) => {
        const phase = id * 2.399;
        const progress = progressRef.current(id); // 0 ~ 1
        const bottomY = ch - 120 - PHYS_R;
        const topY = PHYS_R + 60;
        const floatRange = bottomY - topY;
        const targetY = bottomY - progress * floatRange + Math.sin(phase * 0.5) * 25;
        const dy = targetY - body.position.y;
        const springY = dy * 0.000018;
        const bobX = Math.sin(t * 0.5 + phase) * 0.000035;
        const bobY = Math.sin(t * 0.35 + phase * 1.3) * 0.00002;
        Body.applyForce(body, body.position, { x: bobX, y: springY + bobY });
      });
    };
    Events.on(engine, 'beforeUpdate', beforeUpdateHandler);

    // Mouse / touch drag with click detection
    const mouse = Mouse.create(el);
    // Set pixelRatio to 1 because physics world operates in CSS pixels
    mouse.pixelRatio = 1;
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.5, damping: 0.15, render: { visible: false } },
    });
    Composite.add(engine.world, mc);

    // Click detection: save position + body label at startdrag
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onStartDrag = (e: any) => {
      const body = e.body as Matter.Body | undefined;
      if (body) {
        clickInfoRef.current = {
          x: mc.mouse.position.x,
          y: mc.mouse.position.y,
          label: body.label,
        };
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onEndDrag = (_e: any) => {
      if (!clickInfoRef.current) return;
      const dx = mc.mouse.position.x - clickInfoRef.current.x;
      const dy = mc.mouse.position.y - clickInfoRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const label = clickInfoRef.current.label;
      clickInfoRef.current = null;
      if (dist < 10 && label.startsWith('s-')) {
        const sid = Number(label.slice(2));
        const found = students.find(s => s.id === sid);
        if (found && onSelectRef.current) onSelectRef.current(found);
      }
    };
    Events.on(mc, 'startdrag', onStartDrag);
    Events.on(mc, 'enddrag', onEndDrag);

    const preventScroll = (e: TouchEvent) => { if (mc.body) e.preventDefault(); };
    el.addEventListener('touchmove', preventScroll, { passive: false });

    if (!runnerRef.current) runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engine);
    rafRef.current = requestAnimationFrame(sync);

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      Body.setPosition(walls[0], { x: w / 2, y: h + WALL_T / 2 });
      Body.setVertices(walls[0], Bodies.rectangle(w / 2, h + WALL_T / 2, w * 2, WALL_T).vertices);
      Body.setPosition(walls[1], { x: -WALL_T / 2, y: h / 2 });
      Body.setPosition(walls[2], { x: w + WALL_T / 2, y: h / 2 });
      Body.setPosition(walls[3], { x: w / 2, y: -WALL_T / 2 });
      Body.setVertices(walls[3], Bodies.rectangle(w / 2, -WALL_T / 2, w * 2, WALL_T).vertices);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      el.removeEventListener('touchmove', preventScroll);
      Events.off(engine, 'beforeUpdate', beforeUpdateHandler);
      Events.off(mc, 'startdrag', onStartDrag);
      Events.off(mc, 'enddrag', onEndDrag);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      Composite.remove(engine.world, mc);
    };
  }, [students, sync]);

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden rounded-3xl">
      {/* Dynamic strings layer (behind balloons) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {students.map((student) => {
          const pos = positions.get(student.id);
          if (!pos) return null;

          const pts = stringPointsRef.current.get(student.id);
          if (!pts || pts.length < NUM_STRING_SEGS) return null;

          const kx = pos.x + KNOT_DX;
          const ky = pos.y + KNOT_DY;

          // Smooth curve through knot → segment points using quadratic beziers
          const all = [{ x: kx, y: ky }, ...pts];
          let d = `M ${all[0].x} ${all[0].y}`;
          for (let j = 1; j < all.length - 1; j++) {
            const midX = (all[j].x + all[j + 1].x) / 2;
            const midY = (all[j].y + all[j + 1].y) / 2;
            d += ` Q ${all[j].x} ${all[j].y} ${midX} ${midY}`;
          }
          const last = all[all.length - 1];
          d += ` L ${last.x} ${last.y}`;

          return (
            <path
              key={`string-${student.id}`}
              d={d}
              fill="none"
              stroke={STRING_COLOR}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Balloons */}
      {students.map((student, idx) => {
        const pos = positions.get(student.id);
        if (!pos) return null;
        const progress = getStudentProgress(student.id);
        const isAllDone = progress === 1;
        const c = isAllDone ? DONE_COLOR : BALLOON_COLORS[idx % BALLOON_COLORS.length];

        return (
          <div
            key={student.id}
            className="absolute select-none touch-none"
            style={{
              width: SVG_SIZE,
              height: SVG_SIZE,
              transform: `translate(${pos.x - BCX}px, ${pos.y - BCY}px)`,
              willChange: 'transform',
              cursor: 'grab',
              zIndex: 1,
            }}
          >
            {/* Balloon SVG */}
            <svg
              width={SVG_SIZE}
              height={SVG_SIZE}
              viewBox="0 0 512 512"
              className="absolute inset-0 pointer-events-none"
            >
              <path
                fill={c.fill}
                d="M421.409,275.047c-27.98,52.555-78.792,87.689-136.833,87.689c-88.238,0-159.768-81.201-159.768-181.368C124.808,81.202,196.339,0,284.577,0c111.82,0,189.062,127.395,149.385,245.817"
              />
              <path
                fill={c.shade}
                d="M425.773,263.87c-95.937,89.11-241.868,12.119-241.868-130.201c0-48.897,18.391-92.912,47.741-123.639c-62.448,24.653-107.274,92.049-107.274,171.338c0,93.084,61.775,169.774,141.322,180.158l-6.946,34.134c-1.523,7.568,4.264,14.637,11.985,14.637h30.308c7.664,0,13.438-6.97,12.012-14.5l-6.597-34.824C359.54,352.543,403.995,314.579,425.773,263.87z"
              />
              <ellipse cx="240" cy="100" rx="30" ry="45" fill="white" opacity="0.18" />
            </svg>

            {/* Student name */}
            <span
              className="absolute pointer-events-none font-heading font-bold text-white text-center leading-none"
              style={{
                left: BCX - 30,
                top: TCY - 10,
                width: 60,
                fontSize: student.name.length > 3 ? 13 : 17,
                textShadow: '0 1px 3px rgba(0,0,0,0.35)',
              }}
            >
              {student.name}
            </span>

            {isAllDone && (
              <div
                className="absolute pointer-events-none"
                style={{ left: BCX + 22, top: TCY - 28 }}
              >
                <Sparkles size={20} className="text-amber-300" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.7))' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
