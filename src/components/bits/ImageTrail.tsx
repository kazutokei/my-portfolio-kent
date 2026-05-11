import { gsap } from 'gsap';
import { JSX, useEffect, useRef } from 'react';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
  let clientX = 0,
    clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
    el: null as unknown as HTMLDivElement,
    inner: null
  };
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
  public rect: DOMRect | null = null;
  private resize!: () => void;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner');
    this.getRect();
    this.initEvents();
    
    // Refresh rect when image loads to get natural aspect ratio
    const imgTag = this.DOM.el.querySelector('img');
    if (imgTag) {
      if (imgTag.complete) {
        this.getRect();
      } else {
        imgTag.addEventListener('load', () => this.getRect());
      }
    }
  }

  private initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }

  private getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
}

class ImageTrailVariant8 {
  private container: HTMLDivElement;
  private DOM: { el: HTMLDivElement };
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition: number;
  private zIndexVal: number;
  private activeImagesCount: number;
  private isIdle: boolean;
  private threshold: number;
  private mousePos: { x: number; y: number };
  private lastMousePos: { x: number; y: number };
  private cacheMousePos: { x: number; y: number };
  private rotation: { x: number; y: number };
  private cachedRotation: { x: number; y: number };
  private zValue: number;
  private cachedZValue: number;
  private trailLength: number = 5; // Keep 5 images visible at once
  private visibleImagesQueue: number[] = [];
  private threshold: number;
  private lastShowTime: number = 0;
  private cooldown: number = 150; // Minimum 150ms between pops

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLDivElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.threshold = 100; // Snappier threshold
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.cachedRotation = { x: 0, y: 0 };
    this.zValue = 0;
    this.cachedZValue = 0;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    
    // Directional check: Only pop if movement is more horizontal than vertical
    const dx = Math.abs(this.mousePos.x - this.lastMousePos.x);
    const dy = Math.abs(this.mousePos.y - this.lastMousePos.y);
    const isHorizontal = dx > dy * 1.5; // Threshold for horizontal bias

    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    const now = Date.now();
    if (distance > this.threshold && now - this.lastShowTime > this.cooldown && isHorizontal) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
      this.lastShowTime = now;
    }
    requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 15;
    this.rotation.y = (relX / centerX) * 15;
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const proportion = distanceFromCenter / maxDistance;
    this.zValue = proportion * 400 - 200;
    this.cachedZValue = this.zValue;

    ++this.zIndexVal;
    
    // Calculate the next position
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    // Explicitly hide the "oldest" image in the trail sequence
    let oldestIdx = this.imgPosition - this.trailLength;
    if (oldestIdx < 0) oldestIdx += this.imagesTotal;
    
    const oldestImg = this.images[oldestIdx];
    if (oldestImg && oldestImg !== img) {
      gsap.to(oldestImg.DOM.el, {
        duration: 0.3,
        opacity: 0,
        scale: 0.4,
        z: -300,
        ease: 'power1.in',
        overwrite: true
      });
    }

    // Prepare the new image
    gsap.killTweensOf(img.DOM.el);
    
    // Use cached or estimated dimensions to avoid layout thrashing
    const imgW = img.rect?.width || 280;
    const imgH = img.rect?.height || 220;

    gsap.fromTo(
      img.DOM.el,
      {
        opacity: 1,
        z: 0,
        scale: 0.8,
        zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - imgW / 2,
        y: this.cacheMousePos.y - imgH / 2,
        rotationX: this.cachedRotation.x,
        rotationY: this.cachedRotation.y,
      },
      {
        duration: 0.6,
        ease: 'expo.out',
        scale: 1,
        x: this.mousePos.x - imgW / 2,
        y: this.mousePos.y - imgH / 2,
        rotationX: this.rotation.x,
        rotationY: this.rotation.y,
        force3D: true
      }
    );
  }
}

interface ImageTrailProps {
  items?: string[];
}

export default function ImageTrail({ items = [] }: ImageTrailProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    new ImageTrailVariant8(containerRef.current);
  }, [items]);

  return (
    <div className="w-full h-full relative z-[10] bg-transparent overflow-hidden touch-pan-y" ref={containerRef}>
      {items.map((url, i) => (
        <div
          className="content__img h-[160px] md:h-[220px] w-auto absolute top-0 left-0 opacity-0 [will-change:transform,filter] pointer-events-none"
          key={i}
        >
          <img 
            src={url}
            alt="Graphic"
            className="h-full w-auto object-contain rounded-2xl border border-white/20 shadow-2xl bg-zinc-900/50 backdrop-blur-sm"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
