import { Variants } from 'framer-motion';

interface Transition {
    duration: number;
    delay?: number;
    ease?: number[];
}

interface OpacityVariant {
    opacity: number;
    transition?: Transition;
}

interface OpacityAnimation {
    initial: OpacityVariant;
    enter: OpacityVariant;
}

interface SlideVariant {
    top: number | string;
    transition?: Transition;
}

interface SlideAnimation {
    initial: SlideVariant;
    exit: SlideVariant;
}

export const opacity: Variants = {
    initial: {
        opacity: 0
    },
    enter: {
        opacity: 0.75,
        transition: {duration: 1, delay: 0.2}
    },
}

export const slideUp: Variants = {
    initial: {
        top: 0
    },
    exit: {
        top: "-100vh",
        transition: {duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2}
    }
}