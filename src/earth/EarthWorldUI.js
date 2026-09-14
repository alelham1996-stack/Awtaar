/* =========================================================
   AWTAAR — EARTH WORLD UI
   ========================================================= */

import './earth-world.css';

import GeologyWorldUI from './geology/GeologyWorldUI.js';
import WaterWorldUI from './water/WaterWorldUI.js';

import { t, getLanguage } from '../locales/i18n.js';


export default class EarthWorldUI {

    constructor(earthGalaxyUI, scene = null) {

        this.earthGalaxyUI = earthGalaxyUI;
        this.scene = scene;

        this.container = null;

        /* =====================================================
           EARTH BACKGROUND
           ===================================================== */

        this.backgroundCanvas = null;
        this.backgroundContext = null;
        this.backgroundAnimationFrame = null;

        this.backgroundTime = 0;

        this.backgroundWidth = 0;
        this.backgroundHeight = 0;

        this.backgroundResizeHandler = null;


        /* =====================================================
           CHILD WORLDS
           ===================================================== */

        this.geologyWorldUI = new GeologyWorldUI(
            this,
            scene
        );

        this.waterWorldUI = new WaterWorldUI(
            this,
            scene
        );

        this.worldItems = [];


        this.createUI();
        this.updateLanguage();
    }


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {

        if (this.container) return;


        /* =====================================================
           MAIN CONTAINER
           ===================================================== */

        this.container =
            document.createElement('section');

        this.container.id =
            'awtaar-earth-world';


        /*
         * مهم:
         * نجعل الحاوية نفسها Stack Context مستقلًا.
         */

        this.container.style.position =
            'fixed';

        this.container.style.isolation =
            'isolate';


        /* =====================================================
           EARTH BACKGROUND
           ===================================================== */

        this.createEarthBackground();


        /* =====================================================
           TITLE
           ===================================================== */

        const title =
            document.createElement('h2');

        title.className =
            'awtaar-earth-world-title';

        this.titleElement =
            title;

        this.makeUIElementForeground(title);


        /* =====================================================
           DESCRIPTION
           ===================================================== */

        const description =
            document.createElement('p');

        description.className =
            'awtaar-earth-world-description';

        this.descriptionElement =
            description;

        this.makeUIElementForeground(description);


        /* =====================================================
           WORLDS CONTAINER
           ===================================================== */

        const worlds =
            document.createElement('div');

        worlds.className =
            'awtaar-earth-worlds';

        this.worldsContainer =
            worlds;

        this.makeUIElementForeground(worlds);


        /* =====================================================
           WORLD DATA
           ===================================================== */

        const worldData = [

            /* -------------------------------------------------
               01 — GEOLOGY WORLD
               ------------------------------------------------- */

            {
                id: 'geology',

                symbol: '◈',

                translationKey:
                    'earthWorld.geology.title',

                available: true
            },


            /* -------------------------------------------------
               02 — WATER WORLD
               ------------------------------------------------- */

            {
                id: 'water',

                symbol: '≈',

                translationKey:
                    'earthWorld.water.title',

                available: true
            },


            /* -------------------------------------------------
               03 — VOLCANOES WORLD
               ------------------------------------------------- */

            {
                id: 'volcanoes',

                symbol: '△',

                translationKey:
                    'earthWorld.volcanoes',

                available: false
            },


            /* -------------------------------------------------
               04 — ATMOSPHERE & CLIMATE WORLD
               ------------------------------------------------- */

            {
                id: 'atmosphere',

                symbol: '≋',

                translationKey:
                    'earthWorld.atmosphere',

                available: false
            },


            /* -------------------------------------------------
               05 — LANDFORMS WORLD
               ------------------------------------------------- */

            {
                id: 'landforms',

                symbol: '⌁',

                translationKey:
                    'earthWorld.landforms',

                available: false
            },


            /* -------------------------------------------------
               06 — EARTH SYSTEMS WORLD
               ------------------------------------------------- */

            {
                id: 'systems',

                symbol: '◎',

                translationKey:
                    'earthWorld.systems',

                available: false
            },


            /* -------------------------------------------------
               07 — EARTH MOTION WORLD
               ------------------------------------------------- */

            {
                id: 'motion',

                symbol: '↻',

                translationKey:
                    'earthWorld.motion',

                available: false
            },


            /* -------------------------------------------------
               08 — NATURAL PHENOMENA WORLD
               ------------------------------------------------- */

            {
                id: 'phenomena',

                symbol: '✺',

                translationKey:
                    'earthWorld.phenomena',

                available: false
            }

        ];


        this.worldData =
            worldData;


        /* =====================================================
           CREATE WORLD CARDS
           ===================================================== */

        worldData.forEach(
            (world) => {

                const button =
                    document.createElement('button');

                button.type =
                    'button';

                button.className =
                    'awtaar-earth-world-item';

                button.dataset.world =
                    world.id;


                /*
                 * ضمان أن البطاقات فوق الخلفية.
                 */

                this.makeUIElementForeground(
                    button
                );


                if (!world.available) {

                    button.classList.add(
                        'is-coming-soon'
                    );

                    button.disabled =
                        true;
                }


                /* =================================================
                   CORE
                   ================================================= */

                const core =
                    document.createElement('span');

                core.className =
                    'earth-world-core';

                core.textContent =
                    world.symbol;


                /* =================================================
                   WORLD NAME
                   ================================================= */

                const name =
                    document.createElement('span');

                name.className =
                    'earth-world-name';

                name.dataset.translationKey =
                    world.translationKey;


                /* =================================================
                   STATUS
                   ================================================= */

                const status =
                    document.createElement('span');

                status.className =
                    'earth-world-status';


                if (!world.available) {

                    status.dataset.status =
                        'coming-soon';
                }


                /* =================================================
                   CARD CONTENT
                   ================================================= */

                button.appendChild(core);

                button.appendChild(name);

                if (!world.available) {

                    button.appendChild(status);
                }


                /* =================================================
                   CLICK
                   ================================================= */

                if (world.available) {

                    button.addEventListener(
                        'click',
                        () => {

                            this.selectWorld(
                                world.id
                            );
                        }
                    );
                }


                worlds.appendChild(button);


                this.worldItems.push({

                    data:
                        world,

                    element:
                        button,

                    nameElement:
                        name,

                    statusElement:
                        status

                });

            }
        );


        /* =====================================================
           BACK BUTTON
           ===================================================== */

        const backButton =
            document.createElement('button');

        backButton.type =
            'button';

        backButton.className =
            'awtaar-earth-world-back';

        this.backButton =
            backButton;


        this.makeUIElementForeground(
            backButton
        );


        backButton.addEventListener(
            'click',
            () => {

                this.returnToGalaxy();
            }
        );


        /* =====================================================
           APPEND UI
           ===================================================== */

        this.container.appendChild(
            title
        );

        this.container.appendChild(
            description
        );

        this.container.appendChild(
            worlds
        );

        this.container.appendChild(
            backButton
        );


        /* =====================================================
           INITIAL STATE
           ===================================================== */

        this.container.style.opacity =
            '0';

        this.container.style.visibility =
            'hidden';

        this.container.style.pointerEvents =
            'none';


        document.body.appendChild(
            this.container
        );


        /* =====================================================
           START BACKGROUND
           ===================================================== */

        this.startEarthBackground();
    }


    /* =========================================================
       FORCE UI TO FOREGROUND
       ========================================================= */

    makeUIElementForeground(element) {

        if (!element) return;

        element.style.position =
            'relative';

        element.style.zIndex =
            '10';
    }


    /* =========================================================
       CREATE EARTH BACKGROUND
       ========================================================= */

    createEarthBackground() {

        const canvas =
            document.createElement('canvas');

        canvas.className =
            'earth-world-background';

        canvas.setAttribute(
            'aria-hidden',
            'true'
        );


        /*
         * أهم جزء:
         * الخلفية خلف كل عناصر الواجهة.
         */

        canvas.style.position =
            'absolute';

        canvas.style.inset =
            '0';

        canvas.style.width =
            '100%';

        canvas.style.height =
            '100%';

        canvas.style.zIndex =
            '0';

        canvas.style.pointerEvents =
            'none';


        this.backgroundCanvas =
            canvas;

        this.backgroundContext =
            canvas.getContext('2d');


        if (!this.backgroundContext) {
            return;
        }


        /* =====================================================
           INSERT FIRST
           ===================================================== */

        this.container.insertBefore(
            canvas,
            this.container.firstChild
        );


        /* =====================================================
           RESIZE
           ===================================================== */

        this.backgroundResizeHandler =
            () => {

                this.resizeEarthBackground();
            };


        window.addEventListener(
            'resize',
            this.backgroundResizeHandler,
            {
                passive: true
            }
        );


        requestAnimationFrame(
            () => {

                this.resizeEarthBackground();
            }
        );
    }


    /* =========================================================
       RESIZE BACKGROUND
       ========================================================= */

    resizeEarthBackground() {

        if (
            !this.backgroundCanvas ||
            !this.container
        ) {
            return;
        }


        const rect =
            this.container.getBoundingClientRect();


        const width =
            Math.max(
                1,
                Math.floor(rect.width)
            );


        const height =
            Math.max(
                1,
                Math.floor(rect.height)
            );


        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        this.backgroundWidth =
            width;

        this.backgroundHeight =
            height;


        this.backgroundCanvas.width =
            width * pixelRatio;

        this.backgroundCanvas.height =
            height * pixelRatio;


        this.backgroundCanvas.style.width =
            `${width}px`;

        this.backgroundCanvas.style.height =
            `${height}px`;


        const ctx =
            this.backgroundContext;


        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );
    }


    /* =========================================================
       START BACKGROUND
       ========================================================= */

    startEarthBackground() {

        if (this.backgroundAnimationFrame) {
            return;
        }


        const animate =
            () => {

                if (
                    !this.container ||
                    !this.backgroundContext
                ) {
                    return;
                }


                this.backgroundTime +=
                    0.008;


                this.drawEarthBackground();


                this.backgroundAnimationFrame =
                    requestAnimationFrame(
                        animate
                    );
            };


        this.backgroundAnimationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /* =========================================================
       DRAW EARTH BACKGROUND
       ========================================================= */

    drawEarthBackground() {

        const ctx =
            this.backgroundContext;

        const width =
            this.backgroundWidth;

        const height =
            this.backgroundHeight;


        if (
            !ctx ||
            width <= 0 ||
            height <= 0
        ) {
            return;
        }


        const time =
            this.backgroundTime;


        /* =====================================================
           CLEAR
           ===================================================== */

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* =====================================================
           DEEP EARTH ATMOSPHERE
           ===================================================== */

        const background =
            ctx.createLinearGradient(
                0,
                0,
                0,
                height
            );


        background.addColorStop(
            0,
            '#15110d'
        );

        background.addColorStop(
            0.42,
            '#211811'
        );

        background.addColorStop(
            0.72,
            '#302116'
        );

        background.addColorStop(
            1,
            '#120e0a'
        );


        ctx.fillStyle =
            background;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* =====================================================
           MOVING WARM LIGHT
           ===================================================== */

        const lightX =
            width *
            (
                0.5 +
                Math.sin(time * 0.45) * 0.18
            );


        const lightY =
            height *
            (
                0.28 +
                Math.cos(time * 0.32) * 0.05
            );


        const glow =
            ctx.createRadialGradient(
                lightX,
                lightY,
                0,
                lightX,
                lightY,
                Math.max(width, height) * 0.65
            );


        glow.addColorStop(
            0,
            'rgba(173, 127, 67, 0.13)'
        );

        glow.addColorStop(
            0.45,
            'rgba(125, 88, 48, 0.055)'
        );

        glow.addColorStop(
            1,
            'rgba(0, 0, 0, 0)'
        );


        ctx.fillStyle =
            glow;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* =====================================================
           DISTANT MOUNTAINS
           ===================================================== */

        this.drawMountainRange(
            ctx,
            width,
            height,
            0.53,
            0.20,
            0.015,
            'rgba(57, 42, 29, 0.95)',
            time * 0.08
        );


        this.drawMountainRange(
            ctx,
            width,
            height,
            0.59,
            0.25,
            0.020,
            'rgba(43, 32, 23, 0.98)',
            time * 0.12
        );


        /* =====================================================
           FAR HAZE
           ===================================================== */

        this.drawAtmosphericHaze(
            ctx,
            width,
            height,
            time
        );


        /* =====================================================
           ROCK LAYERS
           ===================================================== */

        this.drawRockLayers(
            ctx,
            width,
            height,
            time
        );


        /* =====================================================
           WATER
           ===================================================== */

        this.drawWater(
            ctx,
            width,
            height,
            time
        );


        /* =====================================================
           FLOATING DUST / SEDIMENT
           ===================================================== */

        this.drawEarthParticles(
            ctx,
            width,
            height,
            time
        );


        /* =====================================================
           DARK VIGNETTE
           ===================================================== */

        const vignette =
            ctx.createRadialGradient(
                width * 0.5,
                height * 0.48,
                Math.min(width, height) * 0.18,
                width * 0.5,
                height * 0.48,
                Math.max(width, height) * 0.78
            );


        vignette.addColorStop(
            0,
            'rgba(0, 0, 0, 0)'
        );

        vignette.addColorStop(
            0.7,
            'rgba(0, 0, 0, 0.08)'
        );

        vignette.addColorStop(
            1,
            'rgba(0, 0, 0, 0.62)'
        );


        ctx.fillStyle =
            vignette;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    }


    /* =========================================================
       MOUNTAIN RANGE
       ========================================================= */

    drawMountainRange(
        ctx,
        width,
        height,
        baseRatio,
        amplitudeRatio,
        speed,
        color,
        offset
    ) {

        const baseY =
            height * baseRatio;

        const amplitude =
            height * amplitudeRatio;


        ctx.beginPath();

        ctx.moveTo(
            0,
            height
        );

        ctx.lineTo(
            0,
            baseY
        );


        const step =
            Math.max(
                45,
                width / 13
            );


        for (
            let x = 0;
            x <= width + step;
            x += step
        ) {

            const wave =
                Math.sin(
                    x * 0.008 +
                    offset
                ) * 0.5;


            const wave2 =
                Math.sin(
                    x * 0.017 -
                    offset * 0.7
                ) * 0.25;


            const peak =
                baseY -
                amplitude *
                (
                    0.55 +
                    wave +
                    wave2
                );


            ctx.lineTo(
                x,
                peak
            );


            ctx.lineTo(
                x + step * 0.5,
                baseY +
                Math.sin(
                    x * 0.012 +
                    offset
                ) *
                height *
                0.018
            );
        }


        ctx.lineTo(
            width,
            height
        );

        ctx.closePath();


        ctx.fillStyle =
            color;

        ctx.fill();


        /* -----------------------------------------------------
           SUBTLE RIDGES
           ----------------------------------------------------- */

        ctx.save();

        ctx.globalAlpha =
            0.18;

        ctx.strokeStyle =
            'rgba(180, 133, 72, 0.35)';

        ctx.lineWidth =
            1;


        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const y =
                baseY -
                amplitude *
                (
                    0.25 +
                    i * 0.11
                );


            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );


            ctx.bezierCurveTo(
                width * 0.25,
                y - height * 0.025,
                width * 0.55,
                y + height * 0.018,
                width,
                y - height * 0.012
            );


            ctx.stroke();
        }


        ctx.restore();
    }


    /* =========================================================
       ATMOSPHERIC HAZE
       ========================================================= */

    drawAtmosphericHaze(
        ctx,
        width,
        height,
        time
    ) {

        ctx.save();


        const drift =
            Math.sin(time * 0.35) *
            width *
            0.025;


        const haze =
            ctx.createLinearGradient(
                0,
                height * 0.35,
                0,
                height * 0.68
            );


        haze.addColorStop(
            0,
            'rgba(202, 164, 108, 0)'
        );

        haze.addColorStop(
            0.45,
            'rgba(190, 151, 96, 0.055)'
        );

        haze.addColorStop(
            1,
            'rgba(190, 151, 96, 0)'
        );


        ctx.fillStyle =
            haze;


        ctx.translate(
            drift,
            0
        );


        ctx.fillRect(
            -width * 0.05,
            height * 0.32,
            width * 1.1,
            height * 0.38
        );


        ctx.restore();
    }


    /* =========================================================
       ROCK LAYERS
       ========================================================= */

    drawRockLayers(
        ctx,
        width,
        height,
        time
    ) {

        const base =
            height * 0.83;


        ctx.save();


        /* -----------------------------------------------------
           MAIN ROCK MASS
           ----------------------------------------------------- */

        ctx.beginPath();

        ctx.moveTo(
            0,
            base
        );


        const segments =
            18;


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const x =
                (width / segments) * i;


            const movement =
                Math.sin(
                    i * 0.9 +
                    time * 0.25
                ) *
                height *
                0.009;


            const y =
                base +
                movement;


            ctx.lineTo(
                x,
                y
            );
        }


        ctx.lineTo(
            width,
            height
        );

        ctx.lineTo(
            0,
            height
        );

        ctx.closePath();


        ctx.fillStyle =
            '#17110c';

        ctx.fill();


        /* -----------------------------------------------------
           GEOLOGICAL LAYERS
           ----------------------------------------------------- */

        const layers = [

            {
                y: 0.875,
                color: 'rgba(111, 76, 43, 0.34)',
                thickness: 7
            },

            {
                y: 0.905,
                color: 'rgba(166, 119, 68, 0.22)',
                thickness: 5
            },

            {
                y: 0.935,
                color: 'rgba(78, 55, 35, 0.48)',
                thickness: 9
            },

            {
                y: 0.965,
                color: 'rgba(187, 137, 76, 0.15)',
                thickness: 4
            }

        ];


        layers.forEach(
            (layer, index) => {

                const y =
                    height * layer.y;


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    y
                );


                for (
                    let x = 0;
                    x <= width;
                    x += Math.max(
                        35,
                        width / 16
                    )
                ) {

                    const localWave =
                        Math.sin(
                            x * 0.012 +
                            index * 1.8 +
                            time * 0.18
                        ) *
                        height *
                        0.006;


                    ctx.lineTo(
                        x,
                        y + localWave
                    );
                }


                ctx.strokeStyle =
                    layer.color;

                ctx.lineWidth =
                    layer.thickness;

                ctx.stroke();
            }
        );


        ctx.restore();
    }


    /* =========================================================
       WATER
       ========================================================= */

    drawWater(
        ctx,
        width,
        height,
        time
    ) {

        const waterTop =
            height * 0.765;


        const waterHeight =
            height * 0.105;


        ctx.save();


        /* -----------------------------------------------------
           WATER BODY
           ----------------------------------------------------- */

        const waterGradient =
            ctx.createLinearGradient(
                0,
                waterTop,
                0,
                waterTop + waterHeight
            );


        waterGradient.addColorStop(
            0,
            'rgba(67, 86, 76, 0.12)'
        );

        waterGradient.addColorStop(
            0.45,
            'rgba(35, 61, 56, 0.18)'
        );

        waterGradient.addColorStop(
            1,
            'rgba(13, 27, 25, 0.06)'
        );


        ctx.fillStyle =
            waterGradient;


        ctx.fillRect(
            0,
            waterTop,
            width,
            waterHeight
        );


        /* -----------------------------------------------------
           MOVING WATER LINES
           ----------------------------------------------------- */

        for (
            let row = 0;
            row < 9;
            row++
        ) {

            const y =
                waterTop +
                row *
                waterHeight *
                0.115;


            const amplitude =
                height *
                (
                    0.0025 +
                    row * 0.00025
                );


            const speed =
                time *
                (
                    0.65 +
                    row * 0.045
                );


            ctx.beginPath();


            const step =
                Math.max(
                    18,
                    width / 34
                );


            for (
                let x = -step;
                x <= width + step;
                x += step
            ) {

                const wave =
                    Math.sin(
                        x * 0.025 +
                        speed +
                        row
                    ) *
                    amplitude;


                const wave2 =
                    Math.sin(
                        x * 0.009 -
                        speed * 0.45
                    ) *
                    amplitude *
                    0.55;


                const currentY =
                    y +
                    wave +
                    wave2;


                if (x === -step) {

                    ctx.moveTo(
                        x,
                        currentY
                    );

                } else {

                    ctx.lineTo(
                        x,
                        currentY
                    );
                }
            }


            ctx.strokeStyle =
                `rgba(171, 151, 111, ${0.10 - row * 0.006})`;

            ctx.lineWidth =
                row % 3 === 0
                    ? 1.4
                    : 0.8;


            ctx.stroke();
        }


        /* -----------------------------------------------------
           MOVING REFLECTION
           ----------------------------------------------------- */

        const reflectionX =
            width *
            (
                0.48 +
                Math.sin(time * 0.3) * 0.08
            );


        const reflection =
            ctx.createRadialGradient(
                reflectionX,
                waterTop + waterHeight * 0.25,
                0,
                reflectionX,
                waterTop + waterHeight * 0.25,
                width * 0.22
            );


        reflection.addColorStop(
            0,
            'rgba(202, 170, 113, 0.075)'
        );

        reflection.addColorStop(
            1,
            'rgba(202, 170, 113, 0)'
        );


        ctx.fillStyle =
            reflection;


        ctx.fillRect(
            0,
            waterTop,
            width,
            waterHeight
        );


        ctx.restore();
    }


    /* =========================================================
       EARTH PARTICLES
       ========================================================= */

    drawEarthParticles(
        ctx,
        width,
        height,
        time
    ) {

        ctx.save();


        const particleCount =
            Math.min(
                75,
                Math.max(
                    35,
                    Math.floor(width / 18)
                )
            );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const seed =
                i * 13.731;


            const baseX =
                (
                    Math.sin(seed * 1.91) * 0.5 +
                    0.5
                ) *
                width;


            const baseY =
                (
                    Math.sin(seed * 2.37) * 0.5 +
                    0.5
                ) *
                height *
                0.74;


            const drift =
                Math.sin(
                    time *
                    (
                        0.25 +
                        (i % 5) * 0.035
                    ) +
                    seed
                ) *
                width *
                0.018;


            const rise =
                (
                    time *
                    (
                        0.012 +
                        (i % 4) * 0.003
                    ) +
                    seed
                ) %
                1;


            const x =
                baseX +
                drift;


            const y =
                baseY -
                rise * height * 0.16;


            const radius =
                0.5 +
                (
                    i % 4
                ) *
                0.35;


            const alpha =
                0.10 +
                (
                    i % 5
                ) *
                0.012;


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                radius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(202, 165, 106, ${alpha})`;


            ctx.fill();
        }


        ctx.restore();
    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {

        if (!this.container) return;


        const language =
            getLanguage();


        /* =====================================================
           DIRECTION
           ===================================================== */

        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr';


        /* =====================================================
           TITLE
           ===================================================== */

        if (this.titleElement) {

            this.titleElement.textContent =
                t('earthWorld.title');
        }


        /* =====================================================
           DESCRIPTION
           ===================================================== */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t('earthWorld.description');
        }


        /* =====================================================
           WORLD NAMES + STATUS
           ===================================================== */

        this.worldItems.forEach(
            (item) => {

                const key =
                    item.data.translationKey;


                if (item.nameElement) {

                    this.nameText =
                        t(key);

                    item.nameElement.textContent =
                        this.nameText;
                }


                if (
                    !item.data.available &&
                    item.statusElement
                ) {

                    item.statusElement.textContent =
                        t(
                            'earthWorld.comingSoon'
                        );
                }

            }
        );


        /* =====================================================
           BACK
           ===================================================== */

        if (this.backButton) {

            this.backButton.textContent =
                t('earthWorld.back');
        }


        /* =====================================================
           CHILD WORLDS
           ===================================================== */

        if (
            this.geologyWorldUI &&
            typeof this.geologyWorldUI.updateLanguage ===
            'function'
        ) {

            this.geologyWorldUI.updateLanguage();
        }


        if (
            this.waterWorldUI &&
            typeof this.waterWorldUI.updateLanguage ===
            'function'
        ) {

            this.waterWorldUI.updateLanguage();
        }
    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {

        if (!this.container) return;


        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'auto';


        requestAnimationFrame(
            () => {

                if (!this.container) return;

                this.container.style.opacity =
                    '1';
            }
        );
    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {

        if (!this.container) return;


        /* =====================================================
           HIDE GEOLOGY WORLD
           ===================================================== */

        if (
            this.geologyWorldUI &&
            typeof this.geologyWorldUI.hide ===
            'function'
        ) {

            this.geologyWorldUI.hide();
        }


        /* =====================================================
           HIDE WATER WORLD
           ===================================================== */

        /*
         * مهم جدًا:
         *
         * WaterWorldUI يحتوي على تجارب مستقلة
         * تُضاف مباشرة إلى document.body.
         *
         * لذلك لا يكفي إخفاء EarthWorldUI فقط.
         *
         * يجب أن يصل hide() إلى WaterWorldUI حتى
         * يغلق WaterCycleExperiment و
         * SurfaceTensionExperiment أيضًا.
         */

        if (
            this.waterWorldUI &&
            typeof this.waterWorldUI.hide ===
            'function'
        ) {

            this.waterWorldUI.hide();
        }


        /* =====================================================
           HIDE EARTH WORLD CONTAINER
           ===================================================== */

        this.container.style.opacity =
            '0';

        this.container.style.pointerEvents =
            'none';


        window.setTimeout(
            () => {

                if (!this.container) return;

                this.container.style.visibility =
                    'hidden';

            },
            550
        );
    }


    /* =========================================================
       SELECT WORLD
       ========================================================= */

    selectWorld(worldId) {

        switch (worldId) {

            case 'geology':

                this.enterGeologyWorld();

                break;


            case 'water':

                this.enterWaterWorld();

                break;


            default:

                break;
        }
    }


    /* =========================================================
       ENTER GEOLOGY WORLD
       ========================================================= */

    enterGeologyWorld() {

        this.hide();


        window.setTimeout(
            () => {

                if (
                    this.geologyWorldUI &&
                    typeof this.geologyWorldUI.show ===
                    'function'
                ) {

                    this.geologyWorldUI.show();
                }

            },
            550
        );
    }


    /* =========================================================
       ENTER WATER WORLD
       ========================================================= */

    enterWaterWorld() {

        this.hide();


        window.setTimeout(
            () => {

                if (
                    this.waterWorldUI &&
                    typeof this.waterWorldUI.show ===
                    'function'
                ) {

                    this.waterWorldUI.show();
                }

            },
            550
        );
    }


    /* =========================================================
       RETURN FROM GEOLOGY WORLD
       ========================================================= */

    returnFromGeologyWorld() {

        if (
            this.geologyWorldUI &&
            typeof this.geologyWorldUI.hide ===
            'function'
        ) {

            this.geologyWorldUI.hide();
        }


        window.setTimeout(
            () => {

                this.show();

            },
            550
        );
    }


    /* =========================================================
       RETURN FROM WATER WORLD
       ========================================================= */

    returnFromWaterWorld() {

        if (
            this.waterWorldUI &&
            typeof this.waterWorldUI.hide ===
            'function'
        ) {

            this.waterWorldUI.hide();
        }


        window.setTimeout(
            () => {

                this.show();

            },
            550
        );
    }


    /* =========================================================
       RETURN TO EARTH GALAXY
       ========================================================= */

    returnToGalaxy() {

        this.hide();


        window.setTimeout(
            () => {

                if (
                    this.earthGalaxyUI &&
                    typeof this.earthGalaxyUI.show ===
                    'function'
                ) {

                    this.earthGalaxyUI.show();
                }

            },
            550
        );
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta) {

        if (
            this.geologyWorldUI &&
            typeof this.geologyWorldUI.update ===
            'function'
        ) {

            this.geologyWorldUI.update(delta);
        }


        if (
            this.waterWorldUI &&
            typeof this.waterWorldUI.update ===
            'function'
        ) {

            this.waterWorldUI.update(delta);
        }
    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(scene) {

        this.scene =
            scene;


        if (
            this.geologyWorldUI &&
            typeof this.geologyWorldUI.setScene ===
            'function'
        ) {

            this.geologyWorldUI.setScene(
                scene
            );
        }


        if (
            this.waterWorldUI &&
            typeof this.waterWorldUI.setScene ===
            'function'
        ) {

            this.waterWorldUI.setScene(
                scene
            );
        }
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        /* =====================================================
           STOP BACKGROUND ANIMATION
           ===================================================== */

        if (
            this.backgroundAnimationFrame
        ) {

            cancelAnimationFrame(
                this.backgroundAnimationFrame
            );

            this.backgroundAnimationFrame =
                null;
        }


        /* =====================================================
           REMOVE RESIZE LISTENER
           ===================================================== */

        if (
            this.backgroundResizeHandler
        ) {

            window.removeEventListener(
                'resize',
                this.backgroundResizeHandler
            );

            this.backgroundResizeHandler =
                null;
        }


        /* =====================================================
           CHILD WORLDS
           ===================================================== */

        if (
            this.geologyWorldUI &&
            typeof this.geologyWorldUI.destroy ===
            'function'
        ) {

            this.geologyWorldUI.destroy();
        }


        if (
            this.waterWorldUI &&
            typeof this.waterWorldUI.destroy ===
            'function'
        ) {

            this.waterWorldUI.destroy();
        }


        this.worldItems = [];


        /* =====================================================
           REMOVE CONTAINER
           ===================================================== */

        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }


        this.backgroundCanvas =
            null;

        this.backgroundContext =
            null;
    }

}