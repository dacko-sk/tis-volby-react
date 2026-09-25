import { useCallback, useEffect, useRef, useState } from 'react';

import { labels, t } from '../../helpers/dictionary';

// free mouse-drag scrolling of a horizontally scrollable element;
// returns a ref telling whether the last press was a drag (to cancel its click)
const useDragScroll = (ref) => {
    const draggedRef = useRef(false);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        let lastX = null;
        let startX = null;

        const onMove = (e) => {
            if (!draggedRef.current && Math.abs(e.clientX - startX) < 5) return;
            if (!draggedRef.current) {
                draggedRef.current = true;
                setDragging(true);
            }
            el.scrollLeft -= e.clientX - lastX;
            lastX = e.clientX;
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            setDragging(false);
        };
        const onDown = (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            startX = e.clientX;
            lastX = e.clientX;
            draggedRef.current = false;
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        };
        const onDragStart = (e) => e.preventDefault();

        el.addEventListener('pointerdown', onDown);
        el.addEventListener('dragstart', onDragStart);
        return () => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('dragstart', onDragStart);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [ref]);

    return [draggedRef, dragging];
};

// full-width carousel, neighbouring slides fade out towards the browser edges
function RacesCarousel({ items, renderSlide }) {
    const trackRef = useRef(null);
    const navRef = useRef(null);
    const slideRefs = useRef([]);
    const pillRefs = useRef([]);
    const [active, setActive] = useState(0);
    const [height, setHeight] = useState(null);

    const suppressClickRef = useRef(false);
    const [navDraggedRef, navDragging] = useDragScroll(navRef);
    const [dragging, setDragging] = useState(false);

    const goTo = useCallback((index) => {
        const track = trackRef.current;
        const slide = slideRefs.current[index];
        if (!track || !slide) return;
        track.scrollTo({
            left:
                slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
            behavior: 'smooth',
        });
    }, []);

    // index of the slide closest to the track center
    const nearestSlide = useCallback(() => {
        const track = trackRef.current;
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDistance = Infinity;
        slideRefs.current.forEach((slide, index) => {
            if (!slide) return;
            const distance = Math.abs(
                slide.offsetLeft + slide.offsetWidth / 2 - center
            );
            if (distance < minDistance) {
                minDistance = distance;
                closest = index;
            }
        });
        return closest;
    }, []);

    // detect the slide closest to the center while scrolling / swiping
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let frame = null;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setActive(nearestSlide()));
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            track.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, [items.length, nearestSlide]);

    // mouse drag navigation (touch & trackpad scroll natively)
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        const threshold = 5; // px before a press becomes a drag
        const swipe = 60; // px needed to move to a neighbouring slide
        let start = null;
        let pendingTarget = null; // slide a previous drag is still scrolling to
        let dragId = 0;

        const onMove = (e) => {
            const dx = e.clientX - start.x;
            if (!start.moved && Math.abs(dx) < threshold) return;
            if (!start.moved) {
                start.moved = true;
                setDragging(true);
                window.getSelection()?.removeAllRanges();
            }
            // incremental, so a drag started during a running slide
            // animation continues from the actual position
            track.scrollLeft -= e.clientX - start.lastX;
            start.lastX = e.clientX;
        };

        const onUp = (e) => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            if (!start.moved) {
                start = null;
                return;
            }
            const dx = e.clientX - start.x;
            const nearest = nearestSlide();
            // short drag springs back, longer one moves at least one slide
            // in the drag direction (or further, if dragged over more slides)
            let target = start.index;
            if (dx < -swipe) target = Math.max(nearest, start.index + 1);
            if (dx > swipe) target = Math.min(nearest, start.index - 1);
            target = Math.max(0, Math.min(items.length - 1, target));
            suppressClickRef.current = true;
            start = null;
            pendingTarget = target;
            dragId += 1;
            const id = dragId;
            goTo(target);

            // re-enable scroll snapping only after the smooth scroll ends
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                track.removeEventListener('scrollend', finish);
                // a newer drag has taken over or is in progress
                if (id !== dragId || start) return;
                pendingTarget = null;
                setDragging(false);
            };
            track.addEventListener('scrollend', finish);
            setTimeout(finish, 800);
        };

        const onDown = (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            start = {
                x: e.clientX,
                lastX: e.clientX,
                index: pendingTarget ?? nearestSlide(),
                moved: false,
            };
            suppressClickRef.current = false;
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        };

        // prevent native drag & drop of links and images inside slides
        const onDragStart = (e) => e.preventDefault();

        track.addEventListener('pointerdown', onDown);
        track.addEventListener('dragstart', onDragStart);
        return () => {
            track.removeEventListener('pointerdown', onDown);
            track.removeEventListener('dragstart', onDragStart);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [goTo, items.length, nearestSlide]);

    // track height follows the active slide
    useEffect(() => {
        const slide = slideRefs.current[active];
        if (!slide) return undefined;
        const observer = new ResizeObserver(() =>
            setHeight(slide.offsetHeight)
        );
        observer.observe(slide);
        return () => observer.disconnect();
    }, [active, items.length]);

    // keep the active pill visible (horizontal scroll of the nav only)
    useEffect(() => {
        const nav = navRef.current;
        const pill = pillRefs.current[active];
        if (!nav || !pill) return;
        nav.scrollTo({
            left: pill.offsetLeft - (nav.clientWidth - pill.offsetWidth) / 2,
            behavior: 'smooth',
        });
    }, [active]);

    if (!items.length) {
        return null;
    }

    const prev = active > 0 ? active - 1 : null;
    const next = active < items.length - 1 ? active + 1 : null;

    return (
        <div className="races-carousel">
            <div className="carousel-controls">
                <button
                    type="button"
                    className="carousel-arrow"
                    disabled={prev === null}
                    onClick={() => goTo(prev)}
                    aria-label={t(labels.regionRaces.previous)}
                    title={t(labels.regionRaces.previous)}
                >
                    ‹
                </button>
                <div
                    className={`carousel-nav${navDragging ? ' dragging' : ''}`}
                    ref={navRef}
                    onClickCapture={(e) => {
                        // a finished mouse drag must not select a tab
                        if (navDraggedRef.current) {
                            navDraggedRef.current = false;
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                >
                    {items.map((item, index) => (
                        <button
                            key={item.key}
                            ref={(el) => {
                                pillRefs.current[index] = el;
                            }}
                            type="button"
                            className={`carousel-pill${index === active ? ' active' : ''}`}
                            aria-current={index === active}
                            onClick={() => goTo(index)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="carousel-arrow"
                    disabled={next === null}
                    onClick={() => goTo(next)}
                    aria-label={t(labels.regionRaces.next)}
                    title={t(labels.regionRaces.next)}
                >
                    ›
                </button>
            </div>

            <div className="carousel-stage">
                <div
                    className={`carousel-track${dragging ? ' dragging' : ''}`}
                    ref={trackRef}
                    style={height ? { height: `${height}px` } : {}}
                    onClickCapture={(e) => {
                        // a finished mouse drag must not trigger a click
                        if (suppressClickRef.current) {
                            suppressClickRef.current = false;
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={item.key}
                            ref={(el) => {
                                slideRefs.current[index] = el;
                            }}
                            className={`carousel-slide${index === active ? ' active' : ''}`}
                            onClickCapture={(e) => {
                                // clicking a faded neighbour slides it in instead of following links
                                if (index !== active) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    goTo(index);
                                }
                            }}
                        >
                            {renderSlide(item, index === active)}
                        </div>
                    ))}
                </div>
                {prev !== null && (
                    <button
                        type="button"
                        className="carousel-side carousel-side-prev"
                        onClick={() => goTo(prev)}
                        aria-label={t(labels.regionRaces.previous)}
                    >
                        ‹
                    </button>
                )}
                {next !== null && (
                    <button
                        type="button"
                        className="carousel-side carousel-side-next"
                        onClick={() => goTo(next)}
                        aria-label={t(labels.regionRaces.next)}
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    );
}

export default RacesCarousel;
