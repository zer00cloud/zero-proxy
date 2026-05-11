halaman dashboard 
 harus sama semua tanpa berbeda sedikit pun tombol dll semua harus sama seperti tombol salin dll 


 <!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Geist:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary": "#ffb783",
                        "surface-dim": "#12131a",
                        "surface-bright": "#383941",
                        "on-tertiary-fixed": "#301400",
                        "surface-tint": "#c0c1ff",
                        "primary-fixed": "#e1e0ff",
                        "on-primary": "#1000a9",
                        "tertiary-container": "#d97721",
                        "surface": "#12131a",
                        "on-tertiary-container": "#452000",
                        "surface-container-lowest": "#0d0e15",
                        "surface-container-highest": "#33343c",
                        "inverse-primary": "#494bd6",
                        "secondary-fixed": "#acedff",
                        "on-tertiary": "#4f2500",
                        "on-error": "#690005",
                        "surface-variant": "#33343c",
                        "secondary-fixed-dim": "#4cd7f6",
                        "outline": "#908fa0",
                        "outline-variant": "#464554",
                        "primary-container": "#8083ff",
                        "surface-container": "#1e1f26",
                        "secondary": "#4cd7f6",
                        "surface-container-high": "#292931",
                        "primary": "#c0c1ff",
                        "background": "#12131a",
                        "on-surface": "#e3e1ec",
                        "on-secondary-fixed-variant": "#004e5c",
                        "on-secondary-container": "#00424e",
                        "surface-container-low": "#1a1b22",
                        "error": "#ffb4ab",
                        "on-primary-fixed-variant": "#2f2ebe",
                        "secondary-container": "#03b5d3",
                        "on-background": "#e3e1ec",
                        "tertiary-fixed": "#ffdcc5",
                        "inverse-on-surface": "#2f3038",
                        "tertiary-fixed-dim": "#ffb783",
                        "on-primary-container": "#0d0096",
                        "on-primary-fixed": "#07006c",
                        "on-secondary-fixed": "#001f26",
                        "on-tertiary-fixed-variant": "#703700",
                        "on-surface-variant": "#c7c4d7",
                        "error-container": "#93000a",
                        "on-secondary": "#003640",
                        "primary-fixed-dim": "#c0c1ff",
                        "on-error-container": "#ffdad6",
                        "inverse-surface": "#e3e1ec"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "md": "24px",
                        "xs": "4px",
                        "sm": "12px",
                        "xl": "64px",
                        "base": "8px",
                        "lg": "40px",
                        "gutter": "24px",
                        "margin": "32px"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "label-sm": ["Geist"],
                        "headline-lg-mobile": ["Inter"],
                        "label-md": ["Geist"],
                        "body-lg": ["Inter"],
                        "display-lg": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .chart-gradient {
            background: linear-gradient(180deg, rgba(192, 193, 255, 0.1) 0%, rgba(192, 193, 255, 0) 100%);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col">
<!-- TopNavBar Implementation -->
<header class="bg-surface-container border-b border-outline-variant/10 docked full-width top-0 z-50">
<div class="flex items-center w-full px-gutter h-16 max-w-7xl mx-auto justify-center">
<div class="text-headline-md font-headline-md font-bold text-primary">ProxyZero</div>
</div>
</header>
<div class="flex flex-1 overflow-hidden">
<!-- Main Content -->
<main class="flex-1 overflow-y-auto p-gutter lg:p-margin bg-background">
<div class="mx-auto space-y-gutter max-w-7xl">
<!-- Monitoring Graph Section -->
<section class="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
<div class="px-md py-sm border-b border-outline-variant/10 flex justify-between items-center">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Usage Statistics</h2>
<p class="font-label-sm text-label-sm text-on-surface-variant">Real-time API traffic monitoring across global clusters</p>
</div>
<div class="flex gap-xs">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                Live Sync
                            </span>
</div>
</div>
<div class="p-md h-64 relative">
<!-- Chart Mockup -->
<div class="absolute inset-x-md bottom-md top-md flex items-end justify-between gap-2"><div class="flex-1 bg-primary/20 rounded-t-sm h-[35%]"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/25 rounded-t-sm h-[65%]"></div><div class="flex-1 bg-primary/60 rounded-t-sm h-[80%]" style="box-shadow: 0 0 15px rgba(192, 193, 255, 0.1);"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[55%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[40%]"></div><div class="flex-1 bg-primary/50 rounded-t-sm h-[70%]"></div><div class="flex-1 bg-primary/35 rounded-t-sm h-[60%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/45 rounded-t-sm h-[75%]"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[65%]"></div><div class="flex-1 bg-primary/25 rounded-t-sm h-[30%]"></div><div class="flex-1 bg-primary/50 rounded-t-sm h-[85%]"></div><div class="flex-1 bg-secondary rounded-t-sm h-[95%]" style="box-shadow: 0 0 25px rgba(76, 215, 246, 0.3);"></div></div>
<div class="absolute inset-0 chart-gradient pointer-events-none"></div>
<div class="absolute inset-x-0 top-0 h-full flex flex-col justify-between py-md pointer-events-none opacity-10">
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
</div>
</div>
</section>
<!-- AI Models Cards Section -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
<!-- Card 1 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">minimax-m2.5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- Card 2 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">big-pickle</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">200,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">128,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- Card 3 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">nemotron-3-super-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">128,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 1 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">glm-4.7-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 2 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">kimi-k2.5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 3 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">glm-5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 4 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">minimax-m2.1-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 5 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">qwen3.6-plus-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">1,048,576</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 6 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">ling-2.6-flash-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,100</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">32,800</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 7 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">grok-code</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 8 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-flash-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">65,536</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 9 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">hy3-preview-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 10 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-pro-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">1,048,576</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 11 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-omni-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 12 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">ring-2.6-1t-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">66,000</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
<!-- New Model 13 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">trinity-large-preview-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between"><div class="flex items-center gap-sm">
<button class="px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all">
        Test
    </button>
</div>
<div class="flex items-center gap-2">
<label class="flex items-center cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-8 h-4 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-0.5 top-0.5 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div></div>
</div>
</div>
<!-- Bottom Status Bar -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">hub</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">1,248</div>
<div class="text-label-sm text-on-surface-variant">Active Nodes</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">speed</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">42ms</div>
<div class="text-label-sm text-on-surface-variant">Avg Latency</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">account_balance_wallet</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">$248.12</div>
<div class="text-label-sm text-on-surface-variant">Usage Balance</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
<span class="material-symbols-outlined">warning</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">0</div>
<div class="text-label-sm text-on-surface-variant">Critical Errors</div>
</div>
</div>
</section>
</div>
</main>
</div>
<!-- Mobile Bottom Navigation -->
<nav class="md:hidden flex justify-around items-center bg-surface-container border-t border-outline-variant/10 h-16 fixed bottom-0 left-0 w-full z-50">
<button class="flex flex-col items-center gap-1 text-primary">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px] font-medium">Dashboard</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">router</span>
<span class="text-[10px] font-medium">Proxies</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">bar_chart</span>
<span class="text-[10px] font-medium">Usage</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">settings</span>
<span class="text-[10px] font-medium">Settings</span>
</button>
</nav>
</body></html>





ketik di klik card yg tidak free maka akan muncul pop up api key seperti ini 



<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Geist:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary": "#ffb783",
                        "surface-dim": "#12131a",
                        "surface-bright": "#383941",
                        "on-tertiary-fixed": "#301400",
                        "surface-tint": "#c0c1ff",
                        "primary-fixed": "#e1e0ff",
                        "on-primary": "#1000a9",
                        "tertiary-container": "#d97721",
                        "surface": "#12131a",
                        "on-tertiary-container": "#452000",
                        "surface-container-lowest": "#0d0e15",
                        "surface-container-highest": "#33343c",
                        "inverse-primary": "#494bd6",
                        "secondary-fixed": "#acedff",
                        "on-tertiary": "#4f2500",
                        "on-error": "#690005",
                        "surface-variant": "#33343c",
                        "secondary-fixed-dim": "#4cd7f6",
                        "outline": "#908fa0",
                        "outline-variant": "#464554",
                        "primary-container": "#8083ff",
                        "surface-container": "#1e1f26",
                        "secondary": "#4cd7f6",
                        "surface-container-high": "#292931",
                        "primary": "#c0c1ff",
                        "background": "#12131a",
                        "on-surface": "#e3e1ec",
                        "on-secondary-fixed-variant": "#004e5c",
                        "on-secondary-container": "#00424e",
                        "surface-container-low": "#1a1b22",
                        "error": "#ffb4ab",
                        "on-primary-fixed-variant": "#2f2ebe",
                        "secondary-container": "#03b5d3",
                        "on-background": "#e3e1ec",
                        "tertiary-fixed": "#ffdcc5",
                        "inverse-on-surface": "#2f3038",
                        "tertiary-fixed-dim": "#ffb783",
                        "on-primary-container": "#0d0096",
                        "on-primary-fixed": "#07006c",
                        "on-secondary-fixed": "#001f26",
                        "on-tertiary-fixed-variant": "#703700",
                        "on-surface-variant": "#c7c4d7",
                        "error-container": "#93000a",
                        "on-secondary": "#003640",
                        "primary-fixed-dim": "#c0c1ff",
                        "on-error-container": "#ffdad6",
                        "inverse-surface": "#e3e1ec"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "md": "24px",
                        "xs": "4px",
                        "sm": "12px",
                        "xl": "64px",
                        "base": "8px",
                        "lg": "40px",
                        "gutter": "24px",
                        "margin": "32px"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "label-sm": ["Geist"],
                        "headline-lg-mobile": ["Inter"],
                        "label-md": ["Geist"],
                        "body-lg": ["Inter"],
                        "display-lg": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .chart-gradient {
            background: linear-gradient(180deg, rgba(192, 193, 255, 0.1) 0%, rgba(192, 193, 255, 0) 100%);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col">
<!-- TopNavBar Implementation -->
<header class="bg-surface-container border-b border-outline-variant/10 docked full-width top-0 z-50">
<div class="flex justify-between items-center w-full px-gutter h-16 max-w-7xl mx-auto">
<div class="text-headline-md font-headline-md font-bold text-primary">ProxyZero</div>
<nav class="hidden md:flex items-center gap-base">
<a class="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" href="#">Dashboard</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 px-3 font-label-md text-label-md" href="#">Analytics</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 px-3 font-label-md text-label-md" href="#">Nodes</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 px-3 font-label-md text-label-md" href="#">Settings</a>
</nav>
<div class="flex items-center gap-sm">
<button class="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</header>
<div class="flex flex-1 overflow-hidden">
<!-- Main Content -->
<main class="flex-1 overflow-y-auto p-gutter lg:p-margin bg-background">
<div class="mx-auto space-y-gutter max-w-7xl">
<!-- Monitoring Graph Section -->
<section class="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
<div class="px-md py-sm border-b border-outline-variant/10 flex justify-between items-center">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Usage Statistics</h2>
<p class="font-label-sm text-label-sm text-on-surface-variant">Real-time API traffic monitoring across global clusters</p>
</div>
<div class="flex gap-xs">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                Live Sync
                            </span>
</div>
</div>
<div class="p-md h-64 relative">
<!-- Chart Mockup -->
<div class="absolute inset-x-md bottom-md top-md flex items-end justify-between gap-2"><div class="flex-1 bg-primary/20 rounded-t-sm h-[35%]"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/25 rounded-t-sm h-[65%]"></div><div class="flex-1 bg-primary/60 rounded-t-sm h-[80%]" style="box-shadow: 0 0 15px rgba(192, 193, 255, 0.1);"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[55%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[40%]"></div><div class="flex-1 bg-primary/50 rounded-t-sm h-[70%]"></div><div class="flex-1 bg-primary/35 rounded-t-sm h-[60%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/45 rounded-t-sm h-[75%]"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[65%]"></div><div class="flex-1 bg-primary/25 rounded-t-sm h-[30%]"></div><div class="flex-1 bg-primary/50 rounded-t-sm h-[85%]"></div><div class="flex-1 bg-secondary rounded-t-sm h-[95%]" style="box-shadow: 0 0 25px rgba(76, 215, 246, 0.3);"></div></div>
<div class="absolute inset-0 chart-gradient pointer-events-none"></div>
<div class="absolute inset-x-0 top-0 h-full flex flex-col justify-between py-md pointer-events-none opacity-10">
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
</div>
</div>
</section>
<!-- AI Models Cards Section -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
<!-- Card 1 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">minimax-m2.5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between gap-md">
<button class="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
        Test
    </button>
<label class="flex items-center gap-sm cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-10 h-5 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-1 top-1 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div>
</div>
<!-- Card 2 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">big-pickle</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">200,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">128,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- Card 3 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">nemotron-3-super-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">128,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 1 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">glm-4.7-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 2 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">kimi-k2.5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 3 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">glm-5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 4 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">minimax-m2.1-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 5 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">qwen3.6-plus-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">1,048,576</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 6 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">ling-2.6-flash-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,100</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">32,800</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 7 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">grok-code</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 8 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-flash-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">65,536</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 9 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">hy3-preview-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 10 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-pro-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">1,048,576</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 11 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-omni-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 12 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">ring-2.6-1t-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">66,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 13 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">trinity-large-preview-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
</div>
<!-- Bottom Status Bar -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">hub</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">1,248</div>
<div class="text-label-sm text-on-surface-variant">Active Nodes</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">speed</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">42ms</div>
<div class="text-label-sm text-on-surface-variant">Avg Latency</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">account_balance_wallet</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">$248.12</div>
<div class="text-label-sm text-on-surface-variant">Usage Balance</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
<span class="material-symbols-outlined">warning</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">0</div>
<div class="text-label-sm text-on-surface-variant">Critical Errors</div>
</div>
</div>
</section>
</div>
</main>
</div>
<!-- Mobile Bottom Navigation -->
<nav class="md:hidden flex justify-around items-center bg-surface-container border-t border-outline-variant/10 h-16 fixed bottom-0 left-0 w-full z-50">
<button class="flex flex-col items-center gap-1 text-primary">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px] font-medium">Dashboard</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">router</span>
<span class="text-[10px] font-medium">Proxies</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">bar_chart</span>
<span class="text-[10px] font-medium">Usage</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">settings</span>
<span class="text-[10px] font-medium">Settings</span>
</button>
</nav>
<!-- API Endpoint Modal -->
<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter">
<!-- Backdrop Overlay -->
<div class="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
<!-- Modal Card -->
<div class="relative w-full max-w-xl bg-surface-container border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden flex flex-col"><!-- Header -->
<div class="px-md py-md border-b border-outline-variant/10 flex items-center justify-between">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary">vpn_key</span>
<h2 class="text-headline-md font-headline-md text-on-surface"> API KEY </h2>
</div>
<button class="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="p-md space-y-md">
<!-- Name Field -->
<div class="space-y-xs">
<label class="text-label-md font-label-md text-on-surface">Name</label>
<input class="w-full bg-surface-container-low border-2 border-error/50 rounded-lg px-sm py-2 text-on-surface focus:outline-none focus:border-error" placeholder="Production Key" type="text"/>
</div>
<!-- API Key Field -->
<div class="space-y-xs">
<label class="text-label-md font-label-md text-on-surface">API Key</label>
<div class="flex gap-sm">
<input class="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg px-sm py-2 text-on-surface focus:outline-none focus:border-primary" type="password" value="••••••••••••••••"/>
<button class="px-md py-2 bg-surface-container-high border border-outline-variant/20 rounded-lg text-on-surface font-label-md hover:bg-surface-variant transition-colors">Check</button>
</div>
</div>
<!-- Priority Field -->
<div class="space-y-xs">
<label class="text-label-md font-label-md text-on-surface">Priority</label>
<input class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-sm py-2 text-on-surface focus:outline-none focus:border-primary" type="number" value="1"/>
</div>
<!-- Proxy Pool Field -->
<!-- Footer Buttons -->
<div class="flex justify-end gap-sm mt-lg pt-md border-t border-outline-variant/10">
<button class="px-xl py-2.5 text-on-surface-variant font-bold text-label-md hover:text-on-surface transition-colors">Cancel</button>
<button class="px-xl py-2.5 bg-primary text-on-primary rounded-lg font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">Save</button>
</div>
</div></div>
</div>
</body></html>



ketika di klik icon robot di setiap card models makan pop up ini 


<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Geist:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary": "#ffb783",
                        "surface-dim": "#12131a",
                        "surface-bright": "#383941",
                        "on-tertiary-fixed": "#301400",
                        "surface-tint": "#c0c1ff",
                        "primary-fixed": "#e1e0ff",
                        "on-primary": "#1000a9",
                        "tertiary-container": "#d97721",
                        "surface": "#12131a",
                        "on-tertiary-container": "#452000",
                        "surface-container-lowest": "#0d0e15",
                        "surface-container-highest": "#33343c",
                        "inverse-primary": "#494bd6",
                        "secondary-fixed": "#acedff",
                        "on-tertiary": "#4f2500",
                        "on-error": "#690005",
                        "surface-variant": "#33343c",
                        "secondary-fixed-dim": "#4cd7f6",
                        "outline": "#908fa0",
                        "outline-variant": "#464554",
                        "primary-container": "#8083ff",
                        "surface-container": "#1e1f26",
                        "secondary": "#4cd7f6",
                        "surface-container-high": "#292931",
                        "primary": "#c0c1ff",
                        "background": "#12131a",
                        "on-surface": "#e3e1ec",
                        "on-secondary-fixed-variant": "#004e5c",
                        "on-secondary-container": "#00424e",
                        "surface-container-low": "#1a1b22",
                        "error": "#ffb4ab",
                        "on-primary-fixed-variant": "#2f2ebe",
                        "secondary-container": "#03b5d3",
                        "on-background": "#e3e1ec",
                        "tertiary-fixed": "#ffdcc5",
                        "inverse-on-surface": "#2f3038",
                        "tertiary-fixed-dim": "#ffb783",
                        "on-primary-container": "#0d0096",
                        "on-primary-fixed": "#07006c",
                        "on-secondary-fixed": "#001f26",
                        "on-tertiary-fixed-variant": "#703700",
                        "on-surface-variant": "#c7c4d7",
                        "error-container": "#93000a",
                        "on-secondary": "#003640",
                        "primary-fixed-dim": "#c0c1ff",
                        "on-error-container": "#ffdad6",
                        "inverse-surface": "#e3e1ec"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "md": "24px",
                        "xs": "4px",
                        "sm": "12px",
                        "xl": "64px",
                        "base": "8px",
                        "lg": "40px",
                        "gutter": "24px",
                        "margin": "32px"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "headline-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "label-sm": ["Geist"],
                        "headline-lg-mobile": ["Inter"],
                        "label-md": ["Geist"],
                        "body-lg": ["Inter"],
                        "display-lg": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .chart-gradient {
            background: linear-gradient(180deg, rgba(192, 193, 255, 0.1) 0%, rgba(192, 193, 255, 0) 100%);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col">
<!-- TopNavBar Implementation -->
<header class="bg-surface-container border-b border-outline-variant/10 docked full-width top-0 z-50">
<div class="flex justify-between items-center w-full px-gutter h-16 max-w-7xl mx-auto">
<div class="text-headline-md font-headline-md font-bold text-primary">ProxyZero</div>
<nav class="hidden md:flex items-center gap-base">
<a class="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" href="#">Dashboard</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 px-3 font-label-md text-label-md" href="#">Analytics</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 px-3 font-label-md text-label-md" href="#">Nodes</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 px-3 font-label-md text-label-md" href="#">Settings</a>
</nav>
<div class="flex items-center gap-sm">
<button class="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</header>
<div class="flex flex-1 overflow-hidden">
<!-- Main Content -->
<main class="flex-1 overflow-y-auto p-gutter lg:p-margin bg-background">
<div class="mx-auto space-y-gutter max-w-7xl">
<!-- Monitoring Graph Section -->
<section class="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
<div class="px-md py-sm border-b border-outline-variant/10 flex justify-between items-center">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Usage Statistics</h2>
<p class="font-label-sm text-label-sm text-on-surface-variant">Real-time API traffic monitoring across global clusters</p>
</div>
<div class="flex gap-xs">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                Live Sync
                            </span>
</div>
</div>
<div class="p-md h-64 relative">
<!-- Chart Mockup -->
<div class="absolute inset-x-md bottom-md top-md flex items-end justify-between gap-2"><div class="flex-1 bg-primary/20 rounded-t-sm h-[35%]"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/25 rounded-t-sm h-[65%]"></div><div class="flex-1 bg-primary/60 rounded-t-sm h-[80%]" style="box-shadow: 0 0 15px rgba(192, 193, 255, 0.1);"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[55%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[40%]"></div><div class="flex-1 bg-primary/50 rounded-t-sm h-[70%]"></div><div class="flex-1 bg-primary/35 rounded-t-sm h-[60%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/45 rounded-t-sm h-[75%]"></div><div class="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div><div class="flex-1 bg-primary/40 rounded-t-sm h-[65%]"></div><div class="flex-1 bg-primary/25 rounded-t-sm h-[30%]"></div><div class="flex-1 bg-primary/50 rounded-t-sm h-[85%]"></div><div class="flex-1 bg-secondary rounded-t-sm h-[95%]" style="box-shadow: 0 0 25px rgba(76, 215, 246, 0.3);"></div></div>
<div class="absolute inset-0 chart-gradient pointer-events-none"></div>
<div class="absolute inset-x-0 top-0 h-full flex flex-col justify-between py-md pointer-events-none opacity-10">
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
<div class="border-t border-on-surface"></div>
</div>
</div>
</section>
<!-- AI Models Cards Section -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
<!-- Card 1 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">minimax-m2.5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<div class="mt-2 flex items-center justify-between gap-md">
<button class="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
        Test
    </button>
<label class="flex items-center gap-sm cursor-pointer group">
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-10 h-5 bg-surface-container-highest rounded-full border border-outline-variant/30 peer-checked:bg-secondary transition-colors"></div>
<div class="absolute left-1 top-1 w-3 h-3 bg-on-surface rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-on-secondary-fixed"></div>
</div>
</label>
</div>
</div>
<!-- Card 2 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">big-pickle</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">200,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">128,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- Card 3 (Existing) -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div><span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-error/10 text-error border border-error/20">FREE</span></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">nemotron-3-super-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">128,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 1 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">glm-4.7-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 2 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">kimi-k2.5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 3 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">glm-5-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 4 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">minimax-m2.1-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">204,800</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 5 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">qwen3.6-plus-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">1,048,576</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 6 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">ling-2.6-flash-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,100</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">32,800</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 7 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">grok-code</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 8 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-flash-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">65,536</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 9 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">hy3-preview-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">256,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 10 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-pro-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">1,048,576</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
<!-- New Model 11 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-secondary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">mimo-v2-omni-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,144</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">64,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-bold text-label-md hover:bg-outline-variant/20 active:scale-95 transition-all border border-outline-variant/20">
                            View Parameters
                        </button>
</div>
<!-- New Model 12 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-tertiary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">ring-2.6-1t-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">262,000</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">66,000</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Deploy Node
                        </button>
</div>
<!-- New Model 13 -->
<div class="bg-surface-container border border-outline-variant/10 rounded-xl p-md flex flex-col gap-sm hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start">
<div class="flex items-center gap-2"><div class="p-2 rounded-lg bg-surface-container-high"><span class="material-symbols-outlined text-primary">smart_toy</span></div></div>
<div class="flex gap-xs">
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
<button class="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors">
<span class="material-symbols-outlined text-[20px]">restart_alt</span>
</button>
</div>
</div>
<div>
<h3 class="font-headline-md text-[20px] text-on-surface leading-tight">trinity-large-preview-free</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Owner: opencode-zen</p>
</div>
<div class="mt-2 space-y-xs">
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Context</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
<div class="flex justify-between items-center py-1.5 border-b border-outline-variant/5">
<span class="font-label-md text-on-surface-variant">Max Output</span>
<span class="font-label-md text-on-surface font-semibold">131,072</span>
</div>
</div>
<button class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-label-md hover:opacity-90 active:scale-95 transition-all">
                            Initialize Model
                        </button>
</div>
</div>
<!-- Bottom Status Bar -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">hub</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">1,248</div>
<div class="text-label-sm text-on-surface-variant">Active Nodes</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">speed</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">42ms</div>
<div class="text-label-sm text-on-surface-variant">Avg Latency</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">account_balance_wallet</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">$248.12</div>
<div class="text-label-sm text-on-surface-variant">Usage Balance</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl border border-outline-variant/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
<span class="material-symbols-outlined">warning</span>
</div>
<div>
<div class="text-[24px] font-bold text-on-surface">0</div>
<div class="text-label-sm text-on-surface-variant">Critical Errors</div>
</div>
</div>
</section>
</div>
</main>
</div>
<!-- Mobile Bottom Navigation -->
<nav class="md:hidden flex justify-around items-center bg-surface-container border-t border-outline-variant/10 h-16 fixed bottom-0 left-0 w-full z-50">
<button class="flex flex-col items-center gap-1 text-primary">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px] font-medium">Dashboard</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">router</span>
<span class="text-[10px] font-medium">Proxies</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">bar_chart</span>
<span class="text-[10px] font-medium">Usage</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">settings</span>
<span class="text-[10px] font-medium">Settings</span>
</button>
</nav>
<!-- API Endpoint Modal -->
<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter">
<!-- Backdrop Overlay -->
<div class="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
<!-- Modal Card -->
<div class="relative w-full max-w-3xl bg-surface-container border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden flex flex-col">
<!-- Header -->
<div class="px-md py-md border-b border-outline-variant/10 flex items-center justify-between">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-tertiary-container">settings_input_component</span>
<h2 class="text-headline-md font-headline-md text-on-surface">API Endpoint</h2>
</div>
<button class="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="p-md space-y-md">
<!-- Endpoint Rows -->
<div class="space-y-sm">
<!-- Local -->
<div class="flex items-center gap-md">
<span class="w-20 px-2.5 py-1 rounded bg-surface-variant text-on-surface-variant text-[10px] font-bold text-center tracking-wider">LOCAL</span>
<div class="flex-1 flex items-center bg-surface-container-low border border-outline-variant/20 rounded-lg px-sm py-2 gap-sm">
<code class="flex-1 text-body-sm font-mono text-on-surface truncate">http://localhost:20129/v1</code>
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
</div>
</div>
<!-- Tunnel -->
<div class="flex items-center gap-md">
<span class="w-20 px-2.5 py-1 rounded bg-tertiary-container/10 text-tertiary-container text-[10px] font-bold text-center tracking-wider">TUNNEL</span>
<div class="flex-1 flex items-center bg-surface-container-low border border-outline-variant/20 rounded-lg px-sm py-2 gap-sm">
<code class="flex-1 text-body-sm font-mono text-on-surface truncate">https://rqcu7gm.9router.com/v1</code>
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">content_copy</span>
</button>
</div>
<button class="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors">
<span class="material-symbols-outlined text-[20px]">power_settings_new</span>
</button>
</div>
<!-- Tailscale -->
<div class="flex items-center gap-md">
<span class="w-20 px-2.5 py-1 rounded bg-surface-variant text-on-surface-variant text-[10px] font-bold text-center tracking-wider">Model</span>
<div class="flex-1 flex items-center bg-surface-container-low border border-outline-variant/20 rounded-lg px-sm py-2 gap-sm"><code class="flex-1 text-body-sm font-mono text-on-surface truncate">minimax-m2.5-free</code><button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">content_copy</span></button></div>
</div>
</div>
<!-- Warning Banners -->
<div class="space-y-sm">
</div>
<!-- Toggle Section -->
</div>
</div>
</div>
</body></html>



semua nya harus sama ui tampilan nya tidak boleh beda kecuali nama sesuai dengan card dll 
