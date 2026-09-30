import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import gsap from 'gsap';

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
  goTo: (targetCardIdx: number) => void;
}

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  onSwap?: (newFrontIdx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  containerClassName?: string;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white/10 bg-zinc-900 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot { x: number; y: number; z: number; zIndex: number; }

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX, y: -i * distY, z: -i * distX * 1.5, zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, { x: slot.x, y: slot.y, z: slot.z, xPercent: -50, yPercent: -50, skewY: skew, transformOrigin: 'center center', zIndex: slot.zIndex, force3D: true });

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(({
  width = 500, height = 400, cardDistance = 60, verticalDistance = 70,
  delay = 5000, pauseOnHover = false, onCardClick, onSwap,
  skewAmount = 6, easing = 'elastic', containerClassName, children
}, ref) => {
  // Smooth, high-performance easing
  const config = easing === 'elastic'
    ? { ease: 'power3.out', durDrop: 0.9, durMove: 0.9, durReturn: 0.9, promoteOverlap: 0.75, returnDelay: 0.08 }
    : { ease: 'power2.inOut', durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.5, returnDelay: 0.15 };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  
  // Stable refs array that persists across parent state re-renders
  const refs = useRef<CardRef[]>([]);
  if (refs.current.length !== childArr.length) {
    refs.current = Array.from({ length: childArr.length }, () => React.createRef<HTMLDivElement>());
  }
  
  // Order of card indices currently at each slot
  const order = useRef<number[]>([]);
  if (order.current.length !== childArr.length) {
    order.current = Array.from({ length: childArr.length }, (_, i) => i);
  }

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const onSwapRef = useRef(onSwap);
  const isAnimating = useRef(false);
  const cardDistRef = useRef(cardDistance);
  const vertDistRef = useRef(verticalDistance);
  const skewRef = useRef(skewAmount);

  useEffect(() => { onSwapRef.current = onSwap; }, [onSwap]);
  useEffect(() => { cardDistRef.current = cardDistance; }, [cardDistance]);
  useEffect(() => { vertDistRef.current = verticalDistance; }, [verticalDistance]);
  useEffect(() => { skewRef.current = skewAmount; }, [skewAmount]);

  // Positions cards for a given order, optionally animated smoothly
  const snapToOrder = (newOrder: number[], animate = false) => {
    const total = refs.current.length;
    newOrder.forEach((cardIdx, slotIdx) => {
      const el = refs.current[cardIdx]?.current;
      if (!el) return;
      const slot = makeSlot(slotIdx, cardDistRef.current, vertDistRef.current, total);
      if (animate) {
        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          xPercent: -50,
          yPercent: -50,
          skewY: skewRef.current,
          zIndex: slot.zIndex,
          duration: 0.6,
          ease: 'power3.out',
          force3D: true
        });
      } else {
        placeNow(el, slot, skewRef.current);
      }
    });
  };

  // Restarts the auto-cycle interval
  const restartInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(autoSwap, delay);
  };

  // The cinematic auto-swap animation
  const autoSwap = () => {
    if (isAnimating.current || order.current.length < 2) return;
    isAnimating.current = true;

    const [front, ...rest] = order.current;
    const elFront = refs.current[front]?.current;
    if (!elFront) { isAnimating.current = false; return; }

    const newOrder = [...rest, front];

    const tl = gsap.timeline({
      onComplete: () => {
        order.current = newOrder;
        isAnimating.current = false;
      }
    });
    tlRef.current = tl;

    tl.to(elFront, { y: '+=450', duration: config.durDrop, ease: config.ease });
    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
    tl.call(() => { onSwapRef.current?.(rest[0]); }, undefined, 'promote');

    rest.forEach((idx, i) => {
      const el = refs.current[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistRef.current, vertDistRef.current, refs.current.length);
      tl.set(el, { zIndex: slot.zIndex }, 'promote');
      tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.08}`);
    });

    const backSlot = makeSlot(refs.current.length - 1, cardDistRef.current, vertDistRef.current, refs.current.length);
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
    tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
    tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');
  };

  // Initial placement on mount
  useEffect(() => {
    snapToOrder(order.current);
  }, []);

  // Auto-cycle interval
  useEffect(() => {
    intervalRef.current = window.setInterval(autoSwap, delay);

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => { tlRef.current?.pause(); clearInterval(intervalRef.current); };
      const resume = () => { tlRef.current?.play(); intervalRef.current = window.setInterval(autoSwap, delay); };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
        tlRef.current?.kill();
      };
    }
    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
  }, [delay, pauseOnHover]);

  useImperativeHandle(ref, () => ({
    // Instantly snap to next card, restart auto-cycle
    next: () => {
      tlRef.current?.kill();
      isAnimating.current = false;
      const newOrder = [...order.current.slice(1), order.current[0]];
      order.current = newOrder;
      snapToOrder(newOrder, true);
      onSwapRef.current?.(newOrder[0]);
      restartInterval();
    },
    // Instantly snap to previous card, restart auto-cycle
    prev: () => {
      tlRef.current?.kill();
      isAnimating.current = false;
      const last = order.current[order.current.length - 1];
      const newOrder = [last, ...order.current.slice(0, -1)];
      order.current = newOrder;
      snapToOrder(newOrder, true);
      onSwapRef.current?.(newOrder[0]);
      restartInterval();
    },
    // Instantly snap to a specific card, restart auto-cycle
    goTo: (targetCardIdx: number) => {
      const pos = order.current.indexOf(targetCardIdx);
      if (pos === 0 || pos === -1) return;
      tlRef.current?.kill();
      isAnimating.current = false;
      const newOrder = [...order.current.slice(pos), ...order.current.slice(0, pos)];
      order.current = newOrder;
      snapToOrder(newOrder, true);
      onSwapRef.current?.(targetCardIdx);
      restartInterval();
    }
  }));

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: child.key ?? i,
          ref: refs.current[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className={containerClassName ?? "absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
});

CardSwap.displayName = 'CardSwap';
export default CardSwap;
