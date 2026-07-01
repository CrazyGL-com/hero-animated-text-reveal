import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import CrazyGLWrapper, { loadGoogleFont, useHeroAnimationFrame, useScrollProgress, useHeroReady, } from '@crazygl/core';
import metadata from './metadata.json';
import './style.css';
/* ─────────────────────────────────────────────────────────────────────────
   Animated Text Reveal — a polished kinetic typography effect.

   Per word i in [0..N-1]:
     local       = (progress * N) - i        // 0..1 window per word
     r           = clamp(local, 0, 1)
     blur(px)    = initialBlur * (1 - r)
     opacity     = initialOpacity + (1 - initialOpacity) * r
     transition  = filter Xs Easing, opacity Xs Easing
     transitionDelay = fadeDelay * i

   Unlike hero #4 (Ultimate Scroll Text) which uses an instantaneous
   wavefront with hard handoffs, this hero uses CSS *transitions* per
   word — so the reveal feels smooth even at fast scroll speeds, and
   never snaps. The two heroes are complementary entries in the typo
   library.
   ───────────────────────────────────────────────────────────────────── */
const WEIGHT_NAMES = {
    '100': '100', '200': '200', '300': '300', '400': '400', '500': '500',
    '600': '600', '700': '700', '800': '800', '900': '900',
};
function makeClickHandler(prop) {
    return (e) => {
        if (typeof prop === 'function') {
            e.preventDefault();
            prop(e);
            return;
        }
        if (typeof prop === 'string' && prop.length > 0) {
            e.preventDefault();
            if (typeof window !== 'undefined')
                window.location.href = prop;
        }
    };
}
function AnimatedTextRevealHero(props) {
    const { rootRef, reducedMotion, interactivity, text = 'This text unblurs and fades in word by word as you scroll.', ctaLabel = '', onCTAClick = '', initialBlur = 3, initialOpacity = 0.15, fadeDuration = 0.3, fadeDelay = 0.02, fadeEasing = 'ease-out', scrollStart = 15, scrollEnd = 70, autoplaySeconds = 5, textColor = '#ffffff', textAlign = 'center', fontSize = 56, lineHeight = 1.2, letterSpacing = -0.01, maxWidth = 900, headingFontFamily = 'Inter', headingFontWeight = '600', transparentBackground = false, bgColor = '#0a0c14', accentColor = '#ff7b00', accentStrength = 0.3, vignetteStrength = 0.35, } = props;
    const ctaText = String(ctaLabel || '').trim();
    const showCta = ctaText.length > 0;
    const ctaHandler = React.useMemo(() => makeClickHandler(onCTAClick), [onCTAClick]);
    const weight = WEIGHT_NAMES[String(headingFontWeight)] ?? '600';
    useHeroReady(props);
    React.useEffect(() => {
        if (!headingFontFamily || headingFontFamily === 'Inherit')
            return;
        try {
            loadGoogleFont(headingFontFamily, {
                weights: ['400', '500', '600', '700', '800', '900'],
            });
        }
        catch { /* non-fatal */ }
    }, [headingFontFamily]);
    const tokens = React.useMemo(() => {
        const out = [];
        let w = 0;
        const lines = String(text || '').replace(/\r/g, '').split('\n');
        for (let li = 0; li < lines.length; li++) {
            const parts = (lines[li] ?? '').split(/(\s+)/).filter((x) => x.length > 0);
            for (const p of parts) {
                if (/^\s+$/.test(p))
                    out.push({ kind: 'space', text: p });
                else
                    out.push({ kind: 'word', text: p, wIdx: w++ });
            }
            if (li < lines.length - 1)
                out.push({ kind: 'br' });
        }
        return out;
    }, [text]);
    const total = tokens.filter((t) => t.kind === 'word').length;
    const wordRefs = React.useRef([]);
    const scrollProg = useScrollProgress(rootRef);
    const autoProgRef = React.useRef(0);
    useHeroAnimationFrame(rootRef, ({ delta }) => {
        // Strict mode dispatch: `scroll` uses the window, `none` runs a
        // one-shot 0→1 sweep. No auto-fallback between the two.
        let progress;
        if (interactivity === 'none') {
            const dur = Math.max(0.5, Number(autoplaySeconds) || 5);
            autoProgRef.current = Math.min(1, autoProgRef.current + delta / dur);
            progress = autoProgRef.current;
        }
        else {
            const sPct = Math.max(0, Math.min(1, (Number(scrollStart) || 0) / 100));
            const ePct = Math.max(sPct + 1e-3, Math.min(1, (Number(scrollEnd) || 100) / 100));
            progress = Math.max(0, Math.min(1, (scrollProg - sPct) / (ePct - sPct)));
        }
        if (reducedMotion)
            progress = 1;
        const N = Math.max(1, total);
        const blur = Math.max(0, Number(initialBlur) || 0);
        const op0 = Math.max(0, Math.min(1, Number(initialOpacity) || 0));
        for (let i = 0; i < total; i++) {
            const el = wordRefs.current[i];
            if (!el)
                continue;
            const local = (progress * N) - i;
            const r = Math.max(0, Math.min(1, local));
            el.style.opacity = (op0 + (1 - op0) * r).toFixed(3);
            el.style.filter = `blur(${(blur * (1 - r)).toFixed(2)}px)`;
        }
    });
    const fallbackFontStack = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    const resolvedFontStack = headingFontFamily && headingFontFamily !== 'Inherit'
        ? `"${headingFontFamily}", ${fallbackFontStack}`
        : `var(--crazygl-font-heading, inherit), ${fallbackFontStack}`;
    const baseStyle = {
        fontFamily: resolvedFontStack,
        fontSize: `${Math.max(14, Number(fontSize) || 56)}px`,
        fontWeight: weight,
        lineHeight: Number(lineHeight) || 1.2,
        letterSpacing: `${Number(letterSpacing) || 0}em`,
        textAlign,
        maxWidth: `${Math.max(280, Number(maxWidth) || 900)}px`,
        width: '100%',
        whiteSpace: 'pre-wrap',
        color: textColor,
        margin: 0,
        padding: 0,
    };
    const stageVars = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--cgl-atr-accent']: accentColor,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--cgl-atr-accent-strength']: accentStrength,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--cgl-atr-vignette']: vignetteStrength,
    };
    const transition = `filter ${Math.max(0.05, Number(fadeDuration) || 0.3)}s ${fadeEasing}, opacity ${Math.max(0.05, Number(fadeDuration) || 0.3)}s ${fadeEasing}`;
    return (_jsxs(_Fragment, { children: [_jsx("crazygl-stage", { style: {
                    ...(transparentBackground ? { background: 'transparent' } : { background: bgColor }),
                    ...stageVars,
                }, children: !transparentBackground ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "crazygl-atr-bloom", "aria-hidden": "true" }), _jsx("div", { className: "crazygl-atr-vignette", "aria-hidden": "true" })] })) : null }), _jsx("crazygl-content", { children: _jsxs("div", { className: "crazygl-atr-content", style: { textAlign }, children: [_jsx("crazygl-heading", { class: "crazygl-atr-heading", role: "heading", "aria-level": 1, style: baseStyle, children: tokens.map((t, i) => {
                                if (t.kind === 'br')
                                    return _jsx("br", {}, `br-${i}`);
                                if (t.kind === 'space')
                                    return _jsx("span", { children: t.text }, `sp-${i}`);
                                const idx = t.wIdx;
                                return (_jsx("span", { ref: (el) => { wordRefs.current[idx] = el; }, className: "crazygl-atr-word", style: {
                                        display: 'inline-block',
                                        opacity: Number(initialOpacity) || 0,
                                        filter: `blur(${Number(initialBlur) || 0}px)`,
                                        transition,
                                        transitionDelay: `${(Number(fadeDelay) || 0) * idx}s`,
                                        willChange: 'opacity, filter',
                                    }, children: t.text }, `w-${i}`));
                            }) }), showCta ? (_jsxs("button", { type: "button", className: "crazygl-atr-cta", onClick: ctaHandler, children: [_jsx("span", { children: ctaText }), _jsx("span", { "aria-hidden": "true", className: "crazygl-atr-cta-arrow", children: "\u2192" })] })) : null] }) })] }));
}
export default function AnimatedTextReveal(props) {
    return _jsx(CrazyGLWrapper, { hero: AnimatedTextRevealHero, metadata: metadata, ...props });
}
export { metadata };
