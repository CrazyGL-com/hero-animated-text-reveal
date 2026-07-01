<sub>*Hero made by [@ybouane](https://x.com/ybouane).*</sub>
<p align="center">
  <img src="https://crazygl.com/heroes/hero-animated-text-reveal/banner-full.png" alt="Animated Text Reveal" width="640">
</p>

# @crazygl/hero-animated-text-reveal

A paragraph that unblurs and fades in word by word as the viewer scrolls — with an initial blur and initial opacity that mean even the un-revealed words sit softly on the page rather than disappearing.

## Demo
[Animated Text Reveal](https://crazygl.com/hero/animated-text-reveal)

## Install

```bash
npm install @crazygl/hero-animated-text-reveal
```

## Usage

```tsx
import AnimatedTextReveal from '@crazygl/hero-animated-text-reveal';

export default function Page() {
  return (
    <AnimatedTextReveal
      text="This text unblurs and fades in word by word as you scroll."
      initialBlur={3}
      initialOpacity={0.15}
      fadeDelay={0.02}
      textColor="#ffffff"
    />
  );
}
```

## Customise

- **Content** — `text` (paragraph copy; Enter for hard line breaks), optional `ctaLabel` + `onCTAClick` (URL or function).
- **Reveal** — `initialBlur`, `initialOpacity`, `fadeDuration`, per-word `fadeDelay`, `fadeEasing`; `scrollStart`/`scrollEnd` window (scroll mode) or `autoplaySeconds` (none mode).
- **Typography** — `textColor`, `textAlign`, `fontSize`, `lineHeight`, `letterSpacing`, `maxWidth`, `headingFontFamily`, `headingFontWeight`.
- **Backdrop** — `transparentBackground`, `bgColor`, accent glow (`accentColor`, `accentStrength`) and `vignetteStrength`.

## Best for

- Brand mission statements and manifesto sections
- Premium SaaS hero stories and agency landing pages
- In-page case-study openers where "coming into focus" is the message



This hero is part of [CrazyGL](https://crazygl.com), a collection of production-ready WebGL, canvas, 3D, and typography effects. Every CrazyGL hero ships with an agent-ready `SKILL.md` file that helps developers and coding agents adapt the effect into custom landing pages and interactive experiences.
