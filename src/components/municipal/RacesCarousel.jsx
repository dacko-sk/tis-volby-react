import { useEffect, useRef, useState } from 'react';

import { labels, t } from '../../helpers/dictionary';

// full-width carousel, neighbouring slides fade out towards the browser edges
function RacesCarousel({ items, renderSlide }) {
    const trackRef = useRef(null);
    const navRef = useRef(null);
    const slideRefs = useRef([]);
    const pillRefs = useRef([]);
    const [active, setActive] = useState(0);
    const [height, setHeight] = useState(null);

    const goTo = (index) => {
        const track = trackRef.current;
        const slide = slideRefs.current[index];
        if (!track || !slide) return;
        track.scrollTo({
            left:
                slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
            behavior: 'smooth',
        });
    };

    // detect the slide closest to the center while scrolling / swiping
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let frame = null;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
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
                setActive(closest);
            });
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            track.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, [items.length]);

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
                <div className="carousel-nav" ref={navRef}>
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
                    className="carousel-track"
                    ref={trackRef}
                    style={height ? { height: `${height}px` } : {}}
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
