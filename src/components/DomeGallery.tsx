import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

type ImageItem = string | { src: string; alt?: string };

type DomeGalleryProps = {
  images?: ImageItem[];
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
};

type ItemDef = {
  src: string;
  alt: string;
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
};

const DEFAULT_IMAGES: ImageItem[] = [
  { src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop', alt: 'Abstract art' },
  { src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop', alt: 'Modern sculpture' },
  { src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop', alt: 'Digital artwork' },
  { src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop', alt: 'Contemporary art' },
  { src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop', alt: 'Geometric pattern' },
  { src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop', alt: 'Textured surface' }
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 350,
  segments: 35
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => { const a = (((deg + 180) % 360) + 360) % 360; return a - 180; };
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

/** Scale (natW x natH) to fit inside (maxW x maxH), preserving ratio. */
function fitIntoBox(natW: number, natH: number, maxW: number, maxH: number) {
  const scale = Math.min(maxW / natW, maxH / natH);
  return { w: Math.round(natW * scale), h: Math.round(natH * scale) };
}

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs  = [-3, -1,  1, 3, 5];
  const coords = xCols.flatMap((x, c) => (c % 2 === 0 ? evenYs : oddYs).map(y => ({ x, y, sizeX: 2, sizeY: 2 })));
  const totalSlots = coords.length;
  if (pool.length === 0) return coords.map(c => ({ ...c, src: '', alt: '' }));
  const norm = pool.map(img => typeof img === 'string' ? { src: img, alt: '' } : { src: img.src || '', alt: img.alt || '' });
  const used = Array.from({ length: totalSlots }, (_, i) => norm[i % norm.length]);
  for (let i = 1; i < used.length; i++) {
    if (used[i].src === used[i - 1].src) {
      for (let j = i + 1; j < used.length; j++) {
        if (used[j].src !== used[i].src) { const t = used[i]; used[i] = used[j]; used[j] = t; break; }
      }
    }
  }
  return coords.map((c, i) => ({ ...c, src: used[i].src, alt: used[i].alt }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  return { rotateY: unit * (offsetX + (sizeX - 1) / 2), rotateX: unit * (offsetY - (sizeY - 1) / 2) };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#060010',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  imageBorderRadius = '30px',
  openedImageBorderRadius = '20px',
  grayscale = true
}: DomeGalleryProps) {
  const rootRef   = useRef<HTMLDivElement>(null);
  const mainRef   = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const scrimRef  = useRef<HTMLDivElement>(null);

  const focusedElRef           = useRef<HTMLElement | null>(null);
  const overlayElRef           = useRef<HTMLElement | null>(null);   // lives on <body>
  const bodyScrimRef           = useRef<HTMLElement | null>(null);   // scrim on <body>
  const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const rotationRef    = useRef({ x: 0, y: 0 });
  const startRotRef    = useRef({ x: 0, y: 0 });
  const startPosRef    = useRef<{ x: number; y: number } | null>(null);
  const draggingRef    = useRef(false);
  const cancelTapRef   = useRef(false);
  const movedRef       = useRef(false);
  const inertiaRAF     = useRef<number | null>(null);
  const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse');
  const tapTargetRef   = useRef<HTMLElement | null>(null);
  const openingRef     = useRef(false);
  const openStartedAt  = useRef(0);
  const lastDragEndAt  = useRef(0);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.style.overflow = 'hidden';
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    scrollLockedRef.current = false;
    document.body.style.overflow = '';
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg: number, yDeg: number) => {
    if (sphereRef.current)
      sphereRef.current.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h), maxDim = Math.max(w, h), aspect = w / h;
      let basis: number;
      switch (fitBasis) {
        case 'min': basis = minDim; break; case 'max': basis = maxDim; break;
        case 'width': basis = w; break;    case 'height': basis = h; break;
        default: basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = clamp(Math.min(basis * fit, h * 1.35), minRadius, maxRadius);
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${Math.max(8, Math.round(minDim * padFactor))}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius]);

  useEffect(() => { applyTransform(rotationRef.current.x, rotationRef.current.y); }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) { cancelAnimationFrame(inertiaRAF.current); inertiaRAF.current = null; }
  }, []);

  const startInertia = useCallback((vx: number, vy: number) => {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80, vY = clamp(vy, -MAX_V, MAX_V) * 80, frames = 0;
    const d = clamp(dragDampening ?? 0.6, 0, 1);
    const frictionMul = 0.94 + 0.055 * d, stopThreshold = 0.015 - 0.01 * d, maxFrames = Math.round(90 + 270 * d);
    const step = () => {
      vX *= frictionMul; vY *= frictionMul;
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) { inertiaRAF.current = null; return; }
      if (++frames > maxFrames) { inertiaRAF.current = null; return; }
      const nx = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const ny = wrapAngleSigned(rotationRef.current.y + vX / 200);
      rotationRef.current = { x: nx, y: ny };
      applyTransform(nx, ny);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia(); inertiaRAF.current = requestAnimationFrame(step);
  }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

  // ── Drag gestures ──────────────────────────────────────────────────────────
  useGesture({
    onDragStart: ({ event }) => {
      if (focusedElRef.current) return;
      stopInertia();
      const evt = event as PointerEvent;
      pointerTypeRef.current = (evt.pointerType as any) || 'mouse';
      if (pointerTypeRef.current === 'touch') { evt.preventDefault(); lockScroll(); }
      draggingRef.current = true; cancelTapRef.current = false; movedRef.current = false;
      startRotRef.current = { ...rotationRef.current };
      startPosRef.current = { x: evt.clientX, y: evt.clientY };
      tapTargetRef.current = (evt.target as Element).closest?.('.item__image') as HTMLElement | null;
    },
    onDrag: ({ event, last, velocity: velArr = [0,0], direction: dirArr = [0,0], movement }) => {
      if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
      const evt = event as PointerEvent;
      if (pointerTypeRef.current === 'touch') evt.preventDefault();
      const dxT = evt.clientX - startPosRef.current.x, dyT = evt.clientY - startPosRef.current.y;
      if (!movedRef.current && dxT * dxT + dyT * dyT > 16) movedRef.current = true;
      const nx = clamp(startRotRef.current.x - dyT / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const ny = startRotRef.current.y + dxT / dragSensitivity;
      if (rotationRef.current.x !== nx || rotationRef.current.y !== ny) {
        rotationRef.current = { x: nx, y: ny }; applyTransform(nx, ny);
      }
      if (last) {
        draggingRef.current = false;
        const dx = evt.clientX - startPosRef.current.x, dy = evt.clientY - startPosRef.current.y;
        const TAP = pointerTypeRef.current === 'touch' ? 10 : 6;
        const isTap = dx * dx + dy * dy <= TAP * TAP;
        let [vMagX, vMagY] = velArr; const [dirX, dirY] = dirArr;
        let vx = vMagX * dirX, vy = vMagY * dirY;
        if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
          const [mx, my] = movement; vx = (mx / dragSensitivity) * 0.02; vy = (my / dragSensitivity) * 0.02;
        }
        if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) startInertia(vx, vy);
        startPosRef.current = null; cancelTapRef.current = !isTap;
        if (isTap && tapTargetRef.current && !focusedElRef.current) openItemFromElement(tapTargetRef.current);
        tapTargetRef.current = null;
        if (cancelTapRef.current) setTimeout(() => (cancelTapRef.current = false), 120);
        if (pointerTypeRef.current === 'touch') unlockScroll();
        if (movedRef.current) lastDragEndAt.current = performance.now();
        movedRef.current = false;
      }
    }
  }, { target: mainRef, eventOptions: { passive: false } });

  // ── Close ──────────────────────────────────────────────────────────────────
  const closeImage = useCallback(() => {
    if (performance.now() - openStartedAt.current < 250) return;
    const el = focusedElRef.current;
    const overlay = overlayElRef.current;
    const bodyScrim = bodyScrimRef.current;
    if (!el || !overlay) return;

    const parent = el.parentElement as HTMLElement;
    const refDiv = parent.querySelector('.item__image--reference') as HTMLElement | null;
    const originalPos = originalTilePositionRef.current;

    // Fade out scrim
    if (bodyScrim) { bodyScrim.style.opacity = '0'; bodyScrim.style.pointerEvents = 'none'; }

    if (!originalPos) {
      overlay.remove(); overlayElRef.current = null;
      if (bodyScrim) { setTimeout(() => bodyScrim.remove(), 400); bodyScrimRef.current = null; }
      if (refDiv) refDiv.remove();
      parent.style.setProperty('--rot-y-delta', '0deg');
      parent.style.setProperty('--rot-x-delta', '0deg');
      el.style.visibility = ''; (el.style as any).zIndex = 0;
      focusedElRef.current = null;
      openingRef.current = false;
      unlockScroll();
      return;
    }

    // Animate overlay back to tile position
    const curRect = overlay.getBoundingClientRect();
    overlay.style.transition = `all ${enlargeTransitionMs}ms cubic-bezier(0.22,1,0.36,1)`;
    overlay.style.left   = `${originalPos.left}px`;
    overlay.style.top    = `${originalPos.top}px`;
    overlay.style.width  = `${originalPos.width}px`;
    overlay.style.height = `${originalPos.height}px`;
    overlay.style.opacity = '0';
    overlay.style.borderRadius = imageBorderRadius;

    const cleanup = () => {
      overlay.remove(); overlayElRef.current = null;
      if (bodyScrim) { bodyScrim.remove(); bodyScrimRef.current = null; }
      if (refDiv) refDiv.remove();
      parent.style.transition = 'none'; el.style.transition = 'none';
      parent.style.setProperty('--rot-y-delta', '0deg');
      parent.style.setProperty('--rot-x-delta', '0deg');
      requestAnimationFrame(() => {
        el.style.visibility = ''; el.style.opacity = '0'; (el.style as any).zIndex = 0;
        focusedElRef.current = null;
        requestAnimationFrame(() => {
          parent.style.transition = ''; el.style.transition = 'opacity 300ms ease-out';
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            setTimeout(() => { el.style.transition = ''; el.style.opacity = ''; openingRef.current = false; unlockScroll(); }, 300);
          });
        });
      });
    };
    overlay.addEventListener('transitionend', cleanup, { once: true });
    // Safety fallback
    setTimeout(cleanup, enlargeTransitionMs + 100);
  }, [enlargeTransitionMs, imageBorderRadius, openedImageBorderRadius, unlockScroll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeImage(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeImage]);

  // ── Open ───────────────────────────────────────────────────────────────────
  const openItemFromElement = (el: HTMLElement) => {
    if (openingRef.current) return;
    openingRef.current = true;
    openStartedAt.current = performance.now();
    lockScroll();

    const parent = el.parentElement as HTMLElement;
    focusedElRef.current = el;

    const offsetX  = getDataNumber(parent, 'offsetX', 0);
    const offsetY  = getDataNumber(parent, 'offsetY', 0);
    const sizeX    = getDataNumber(parent, 'sizeX', 2);
    const sizeY    = getDataNumber(parent, 'sizeY', 2);
    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
    const parentY  = normalizeAngle(parentRot.rotateY);
    const globalY  = normalizeAngle(rotationRef.current.y);
    let rotY = -(parentY + globalY) % 360;
    if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - rotationRef.current.x;
    parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
    parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

    // Invisible reference to measure tile's viewport position
    const refDiv = document.createElement('div');
    refDiv.className = 'item__image item__image--reference';
    refDiv.style.cssText = 'position:absolute;inset:10px;pointer-events:none;opacity:0;';
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv);
    void refDiv.offsetHeight;

    const tileR = refDiv.getBoundingClientRect();
    if (tileR.width <= 0 || tileR.height <= 0) {
      parent.removeChild(refDiv);
      focusedElRef.current = null; openingRef.current = false; unlockScroll(); return;
    }

    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    el.style.visibility = 'hidden'; (el.style as any).zIndex = 0;

    const rawSrc = parent.dataset.src || (el.querySelector('img') as HTMLImageElement)?.src || '';
    const rawAlt = parent.dataset.alt || (el.querySelector('img') as HTMLImageElement)?.alt || '';

    const showOverlay = (natW: number, natH: number) => {
      // ── The overlay lives on document.body ──────────────────────────────
      // This means NO overflow:hidden from any ancestor can clip it.
      // We position it using fixed viewport coords (getBoundingClientRect values).

      const VW = window.innerWidth;
      const VH = window.innerHeight;
      const PAD = Math.min(60, VW * 0.05, VH * 0.05); // responsive padding
      const maxW = VW - PAD * 2;
      const maxH = VH - PAD * 2;

      // Fit image into viewport while preserving its true aspect ratio
      const { w: imgW, h: imgH } = fitIntoBox(natW, natH, maxW, maxH);

      // Centered in viewport
      const destLeft = (VW - imgW) / 2;
      const destTop  = (VH - imgH) / 2;

      // ── Body scrim ──────────────────────────────────────────────────────
      const bodyScrim = document.createElement('div');
      bodyScrim.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99998;
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        opacity: 0;
        transition: opacity ${enlargeTransitionMs}ms ease;
        cursor: pointer;
      `;
      bodyScrim.addEventListener('click', closeImage);
      document.body.appendChild(bodyScrim);
      bodyScrimRef.current = bodyScrim;

      // ── Overlay ─────────────────────────────────────────────────────────
      const overlay = document.createElement('div');
      overlay.className = 'dome-gallery-overlay enlarge';
      overlay.style.cssText = `
        position: fixed;
        left: ${tileR.left}px;
        top: ${tileR.top}px;
        width: ${tileR.width}px;
        height: ${tileR.height}px;
        z-index: 99999;
        border-radius: ${imageBorderRadius};
        overflow: hidden;
        box-shadow: 0 30px 100px rgba(0,0,0,0.8);
        opacity: 0;
        will-change: left, top, width, height, opacity, border-radius;
        transition:
          left   ${enlargeTransitionMs}ms cubic-bezier(0.22,1,0.36,1),
          top    ${enlargeTransitionMs}ms cubic-bezier(0.22,1,0.36,1),
          width  ${enlargeTransitionMs}ms cubic-bezier(0.22,1,0.36,1),
          height ${enlargeTransitionMs}ms cubic-bezier(0.22,1,0.36,1),
          opacity ${Math.round(enlargeTransitionMs * 0.6)}ms ease,
          border-radius ${enlargeTransitionMs}ms ease;
        cursor: pointer;
      `;
      overlay.addEventListener('click', closeImage);

      const img = document.createElement('img');
      img.src = rawSrc;
      img.alt = rawAlt;
      // The container is sized to the image's real aspect ratio,
      // so object-fit:contain shows 100% of the image, no cropping at all.
      img.style.cssText = `
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: ${grayscale ? 'grayscale(1)' : 'none'};
      `;
      overlay.appendChild(img);
      document.body.appendChild(overlay);
      overlayElRef.current = overlay;

      // Force reflow so the initial state is painted, then animate to destination
      void overlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bodyScrim.style.opacity = '1';
          overlay.style.opacity = '1';
          overlay.style.left   = `${destLeft}px`;
          overlay.style.top    = `${destTop}px`;
          overlay.style.width  = `${imgW}px`;
          overlay.style.height = `${imgH}px`;
          overlay.style.borderRadius = openedImageBorderRadius;
        });
      });
    };

    // Probe image natural size, then show
    const probe = new Image();
    probe.onload  = () => showOverlay(probe.naturalWidth,  probe.naturalHeight);
    probe.onerror = () => showOverlay(tileR.width, tileR.height); // fallback: use tile ratio
    probe.src = rawSrc;
  };

  useEffect(() => () => {
    document.body.style.overflow = '';
    // Clean up any orphaned overlays on unmount
    document.querySelectorAll('.dome-gallery-overlay').forEach(el => el.remove());
  }, []);

  // ── Styles ─────────────────────────────────────────────────────────────────
  const css = `
    .sphere-root {
      --radius: 520px;
      --circ: calc(var(--radius) * 3.14);
      --rot-y: calc((360deg / var(--segments-x)) / 2);
      --rot-x: calc((360deg / var(--segments-y)) / 2);
      --item-width: calc(var(--circ) / var(--segments-x));
      --item-height: calc(var(--circ) / var(--segments-y));
    }
    .sphere-root * { box-sizing: border-box; }
    .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }
    .stage {
      width:100%; height:100%; display:grid; place-items:center;
      position:absolute; inset:0; margin:auto;
      perspective:calc(var(--radius) * 2); perspective-origin:50% 50%;
    }
    .sphere { transform:translateZ(calc(var(--radius)*-1)); will-change:transform; position:absolute; }
    .sphere-item {
      width:calc(var(--item-width)*var(--item-size-x));
      height:calc(var(--item-height)*var(--item-size-y));
      position:absolute; top:-999px; bottom:-999px; left:-999px; right:-999px;
      margin:auto; transform-origin:50% 50%; backface-visibility:hidden; transition:transform 300ms;
      transform:
        rotateY(calc(var(--rot-y)*(var(--offset-x)+((var(--item-size-x)-1)/2))+var(--rot-y-delta,0deg)))
        rotateX(calc(var(--rot-x)*(var(--offset-y)-((var(--item-size-y)-1)/2))+var(--rot-x-delta,0deg)))
        translateZ(var(--radius));
    }
    .item__image {
      position:absolute; inset:10px; border-radius:var(--tile-radius,12px);
      overflow:hidden; cursor:pointer; backface-visibility:hidden;
      -webkit-backface-visibility:hidden; transition:transform 300ms; pointer-events:auto;
    }
  `;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        ref={rootRef}
        className="sphere-root relative w-full h-full"
        style={{
          ['--segments-x' as any]: segments,
          ['--segments-y' as any]: segments,
          ['--tile-radius' as any]: imageBorderRadius,
          ['--image-filter' as any]: grayscale ? 'grayscale(1)' : 'none',
        } as React.CSSProperties}
      >
        <main
          ref={mainRef}
          className="absolute inset-0 grid place-items-center overflow-hidden select-none bg-transparent"
          style={{ touchAction: 'none', WebkitUserSelect: 'none' }}
        >
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="sphere-item absolute m-auto"
                  data-src={it.src} data-alt={it.alt}
                  data-offset-x={it.x} data-offset-y={it.y}
                  data-size-x={it.sizeX} data-size-y={it.sizeY}
                  style={{
                    ['--offset-x' as any]: it.x,   ['--offset-y' as any]: it.y,
                    ['--item-size-x' as any]: it.sizeX, ['--item-size-y' as any]: it.sizeY,
                    top:'-999px', bottom:'-999px', left:'-999px', right:'-999px'
                  } as React.CSSProperties}
                >
                  <div
                    className="item__image absolute block overflow-hidden cursor-pointer bg-gray-200"
                    role="button" tabIndex={0} aria-label={it.alt || 'Open image'}
                    onClick={e => {
                      if (draggingRef.current || movedRef.current) return;
                      if (performance.now() - lastDragEndAt.current < 80) return;
                      if (openingRef.current) return;
                      openItemFromElement(e.currentTarget as HTMLElement);
                    }}
                    onPointerUp={e => {
                      if ((e.nativeEvent as PointerEvent).pointerType !== 'touch') return;
                      if (draggingRef.current || movedRef.current) return;
                      if (performance.now() - lastDragEndAt.current < 80) return;
                      if (openingRef.current) return;
                      openItemFromElement(e.currentTarget as HTMLElement);
                    }}
                    style={{ inset:'10px', borderRadius:`var(--tile-radius,${imageBorderRadius})`, backfaceVisibility:'hidden' }}
                  >
                    <img
                      src={it.src} draggable={false} alt={it.alt}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ backfaceVisibility:'hidden', filter:`var(--image-filter,${grayscale?'grayscale(1)':'none'})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edge vignette */}
          <div className="absolute inset-0 z-[3] pointer-events-none" style={{
            backgroundImage:`radial-gradient(rgba(235,235,235,0) 65%,var(--overlay-blur-color,${overlayBlurColor}) 100%)`
          }}/>
          <div className="absolute inset-0 z-[3] pointer-events-none" style={{
            WebkitMaskImage:`radial-gradient(rgba(235,235,235,0) 70%,var(--overlay-blur-color,${overlayBlurColor}) 90%)`,
            maskImage:`radial-gradient(rgba(235,235,235,0) 70%,var(--overlay-blur-color,${overlayBlurColor}) 90%)`,
            backdropFilter:'blur(3px)'
          }}/>
          <div className="absolute left-0 right-0 top-0 h-[120px] z-[5] pointer-events-none rotate-180" style={{
            background:`linear-gradient(to bottom,transparent,var(--overlay-blur-color,${overlayBlurColor}))`
          }}/>
          <div className="absolute left-0 right-0 bottom-0 h-[120px] z-[5] pointer-events-none" style={{
            background:`linear-gradient(to bottom,transparent,var(--overlay-blur-color,${overlayBlurColor}))`
          }}/>
        </main>
      </div>
    </>
  );
}
