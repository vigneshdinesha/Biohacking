import { Zap, Target, Brain, Sun, Snowflake, Clock, Heart, Leaf, Moon, Activity, Coffee } from "lucide-react"

export interface BiohackData {
  title: string
  icon: any
  color: string
  technique: string
  action: string[]
  science: {
    mechanism: string
    studies: string
    biology: string
  }
}

export const biohackData: Record<string, BiohackData> = {
  // LIFESTYLE TAB BIOHACKS
  "Feel more alert for 2 hours": {
    title: "Feel More Alert for 2 Hours",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    technique: "Cold Water Face Plunge + Breathing Protocol",
    action: [
      "Fill a large bowl with ice-cold water (50-60°F / 10-15°C)",
      "Take 3 deep breaths, then plunge your face for 15-30 seconds",
      "Immediately follow with 4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s",
      "Repeat the face plunge 2 more times with breathing between",
      "Finish with 10 rapid belly breaths to oxygenate",
      "Effects peak within 5 minutes and last 1-3 hours",
    ],
    science: {
      mechanism:
        "Cold exposure triggers the mammalian dive reflex, instantly activating the sympathetic nervous system and releasing norepinephrine and dopamine. The breathing protocol optimizes oxygen delivery to the prefrontal cortex while balancing autonomic nervous system activation.",
      studies:
        "Research from Stanford shows cold exposure increases norepinephrine by 200-300%, improving focus and alertness for 1-3 hours. Combined breathwork enhances cognitive performance by 23% in attention-based tasks and reduces reaction time by 12%.",
      biology:
        "Cold water activates thermoreceptors and trigeminal nerve, sending signals to the locus coeruleus (brain's alarm center). This releases norepinephrine, which sharpens focus and increases heart rate variability, while controlled breathing activates the vagus nerve for sustained alertness without anxiety.",
    },
  },

  "Boost focus naturally": {
    title: "Boost Focus Naturally",
    icon: Target,
    color: "from-blue-400 to-purple-500",
    technique: "40Hz Gamma Waves + Eye Movement Protocol",
    action: [
      "Put on 40Hz binaural beats or isochronic tones (use headphones)",
      "Set timer for 25 minutes of focused work (Pomodoro technique)",
      "Every 5 minutes, do 20 slow horizontal eye movements (left-right)",
      "Keep head still, only move eyes from far left to far right",
      "Take 5-minute break with eyes closed after each session",
      "Repeat cycle 3-4 times for maximum cognitive enhancement",
    ],
    science: {
      mechanism:
        "40Hz gamma waves synchronize neural networks in the prefrontal cortex and parietal regions involved in sustained attention. Horizontal eye movements activate the frontal eye fields and dorsolateral prefrontal cortex, enhancing cognitive control and working memory.",
      studies:
        "MIT research shows 40Hz stimulation increases sustained attention by 31% and working memory capacity by 18%. Eye movement exercises boost executive function scores by 25% and reduce mind-wandering by 40% in just 2 weeks of daily practice.",
      biology:
        "Gamma wave entrainment creates neural synchrony between attention networks, while saccadic eye movements stimulate the superior colliculus and frontal eye fields. This enhances top-down attention control and strengthens connections between prefrontal and parietal attention networks.",
    },
  },

  "Optimize sleep cycles": {
    title: "Optimize Sleep Cycles",
    icon: Moon,
    color: "from-indigo-400 to-purple-600",
    technique: "Temperature Drop + Light Manipulation Protocol",
    action: [
      "2 hours before bed: Dim all lights to <10 lux (use dim red lights)",
      "1 hour before: Take hot bath/shower (104-108°F) for 10-15 minutes",
      "30 minutes before: Set room temperature to 65-68°F (18-20°C)",
      "Wear minimal clothing to bed to facilitate heat loss",
      "Upon waking: Get 10+ minutes of bright light (>1000 lux) within 30 minutes",
      "Track sleep with app to optimize personal timing",
    ],
    science: {
      mechanism:
        "Core body temperature drop of 2-3°F triggers melatonin release from the pineal gland. Light exposure resets circadian rhythms by suppressing melatonin production and synchronizing the suprachiasmatic nucleus (SCN) with environmental light cycles.",
      studies:
        "Temperature manipulation improves sleep onset by 36% and increases deep sleep by 15%. Morning light therapy advances circadian phase by 1-2 hours and improves sleep quality scores by 42%. Cool sleeping environments increase REM sleep by 18%.",
      biology:
        "Hot-to-cold temperature transition mimics natural circadian cooling, signaling the hypothalamus to release melatonin. Light photons activate intrinsically photosensitive retinal ganglion cells (ipRGCs), sending timing signals via the retinohypothalamic tract to synchronize the master circadian clock.",
    },
  },

  "Increase energy levels": {
    title: "Increase Energy Levels",
    icon: Activity,
    color: "from-red-400 to-pink-500",
    technique: "Mitochondrial Activation Stack",
    action: [
      "Morning: 2-3 minutes of high-intensity exercise (burpees, jumping jacks)",
      "Midday: 10-15 minutes direct sunlight exposure (no sunglasses)",
      "Afternoon: 4-7-8 breathing technique (4 cycles)",
      "Evening: Cold shower for 2-3 minutes before dinner",
      "Daily: Consume 200-400mg CoQ10 or eat organ meats",
      "Weekly: One 24-hour fast to trigger mitochondrial biogenesis",
    ],
    science: {
      mechanism:
        "High-intensity exercise activates PGC-1α, the master regulator of mitochondrial biogenesis. Sunlight provides red and near-infrared light that enhances cytochrome c oxidase efficiency. Cold exposure activates brown adipose tissue and increases mitochondrial density.",
      studies:
        "HIIT increases mitochondrial capacity by 20% in just 2 weeks. Red light therapy (660-850nm) improves cellular ATP production by 25%. Cold thermogenesis increases mitochondrial biogenesis by 300% and metabolic rate by 15%.",
      biology:
        "Exercise triggers AMPK activation, which stimulates mitochondrial biogenesis through PGC-1α upregulation. Photobiomodulation enhances Complex IV efficiency in the electron transport chain. Cold stress activates UCP1 in brown fat, creating new mitochondria for thermogenesis.",
    },
  },

  "Enhance metabolism": {
    title: "Enhance Metabolism",
    icon: Coffee,
    color: "from-orange-400 to-red-500",
    technique: "Metabolic Flexibility Protocol",
    action: [
      "Morning: Drink 16oz cold water immediately upon waking",
      "Pre-meal: 1-2 tablespoons apple cider vinegar in water",
      "Exercise: 2-3 minutes high-intensity before meals",
      "Meals: Eat protein first, then vegetables, then carbs",
      "Timing: 12-hour eating window (e.g., 8am-8pm)",
      "Weekly: One 16-24 hour fast to reset metabolic flexibility",
    ],
    science: {
      mechanism:
        "Cold water increases thermogenesis by 30% for 60-90 minutes. Acetic acid improves insulin sensitivity and glucose uptake. Pre-meal exercise activates GLUT4 transporters, enhancing nutrient partitioning and metabolic rate.",
      studies:
        "Cold water consumption increases metabolic rate by 30% for 90 minutes. Apple cider vinegar reduces post-meal glucose by 34% and improves insulin sensitivity by 19%. Pre-meal exercise increases glucose uptake by 40% for 2-3 hours.",
      biology:
        "Cold-induced thermogenesis activates brown adipose tissue and increases norepinephrine release. Acetic acid activates AMPK, improving glucose metabolism. Exercise-induced muscle contractions translocate GLUT4 to cell membranes, enhancing glucose uptake independent of insulin.",
    },
  },

  "Cold exposure therapy": {
    title: "Cold Exposure Therapy",
    icon: Snowflake,
    color: "from-cyan-400 to-blue-500",
    technique: "Progressive Cold Adaptation Protocol",
    action: [
      "Week 1-2: End shower with 30-60 seconds cold water (60-70°F)",
      "Week 3-4: Increase to 2 minutes cold exposure",
      "Week 5-6: Ice bath 2-3 minutes at 50-59°F, 2-3x per week",
      "Week 7+: Work up to 5 minutes, maintain 3x weekly",
      "Always control breathing: slow, deep breaths throughout",
      "Exit if shivering becomes uncontrollable",
    ],
    science: {
      mechanism:
        "Cold stress activates brown adipose tissue (BAT), increases norepinephrine 200-300%, and triggers cold shock proteins. This enhances mitochondrial biogenesis, improves insulin sensitivity, and builds psychological resilience through controlled stress adaptation.",
      studies:
        "Regular cold exposure increases metabolism by 15%, improves insulin sensitivity by 25%, and boosts immune function markers by 40%. Cold therapy reduces inflammation (IL-6) by 40% and increases adiponectin by 70%, improving metabolic health.",
      biology:
        "Cold activates the sympathetic nervous system, releasing norepinephrine from nerve terminals. This triggers UCP1 expression in brown fat, generating heat through mitochondrial uncoupling. Cold shock proteins (RBM3) protect against neurodegeneration and enhance synaptic plasticity.",
    },
  },

  "Intermittent fasting": {
    title: "Intermittent Fasting",
    icon: Clock,
    color: "from-purple-400 to-pink-500",
    technique: "16:8 Time-Restricted Eating Protocol",
    action: [
      "Choose consistent 8-hour eating window (e.g., 12pm-8pm)",
      "Fast for 16 hours including sleep (8pm-12pm next day)",
      "During fast: Water, black coffee, plain tea, electrolytes only",
      "Break fast with protein and healthy fats, avoid refined carbs",
      "Gradually extend to 18:6 or 20:4 if comfortable",
      "Take one day off per week to prevent metabolic adaptation",
    ],
    science: {
      mechanism:
        "Fasting triggers autophagy (cellular cleanup), metabolic switching from glucose to ketones, and activates longevity pathways including AMPK and sirtuins. This promotes cellular repair, reduces inflammation, and enhances metabolic flexibility.",
      studies:
        "16:8 IF reduces body weight by 3-8%, improves insulin sensitivity by 20-31%, and increases growth hormone by 300-500%. Studies show 15% reduction in inflammatory markers and 10-15% increase in lifespan in animal models.",
      biology:
        "During fasting, glycogen depletion triggers gluconeogenesis and ketogenesis. This activates PGC-1α for mitochondrial biogenesis and inhibits mTOR, promoting autophagy. Ketones provide neuroprotective effects and enhance BDNF production for brain health.",
    },
  },

  "Morning sunlight": {
    title: "Morning Sunlight",
    icon: Sun,
    color: "from-yellow-300 to-orange-400",
    technique: "Circadian Light Exposure Protocol",
    action: [
      "Within 30 minutes of waking, go outside (no windows/glass)",
      "Face east toward sunrise for 10-20 minutes",
      "No sunglasses - let light hit your eyes directly (don't stare at sun)",
      "If cloudy, extend to 20-30 minutes for adequate lux exposure",
      "Combine with light movement, stretching, or walking",
      "Consistency is key - do this daily, even on weekends",
    ],
    science: {
      mechanism:
        "Morning light exposure to specialized retinal ganglion cells (ipRGCs) sends non-visual signals to the suprachiasmatic nucleus, setting your circadian clock. This optimizes cortisol awakening response, evening melatonin production, and core body temperature rhythms.",
      studies:
        "Morning light therapy increases daytime alertness by 25%, improves mood scores by 30%, and advances sleep phase by 1.5 hours. Consistent exposure reduces seasonal depression by 60% and improves sleep quality by 42%.",
      biology:
        "Intrinsically photosensitive retinal ganglion cells detect blue light (480nm peak sensitivity), sending signals via the retinohypothalamic tract to the SCN. This synchronizes peripheral clocks throughout the body and optimizes hormone release timing for peak performance.",
    },
  },

  // FEEL GOOD TAB BIOHACKS
  "Come back to present moment": {
    title: "Come Back to Present Moment",
    icon: Brain,
    color: "from-green-400 to-teal-500",
    technique: "5-4-3-2-1 Sensory Grounding Technique",
    action: [
      "Notice and name 5 things you can see around you",
      "Identify and touch 4 different textures or objects",
      "Listen for and identify 3 distinct sounds in your environment",
      "Find and focus on 2 different scents you can smell",
      "Notice 1 taste in your mouth or eat something mindfully",
      "Take 3 deep breaths and notice how your body feels now",
    ],
    science: {
      mechanism:
        "Sensory grounding activates the parasympathetic nervous system, reducing cortisol and activating the prefrontal cortex. This interrupts the default mode network associated with rumination, anxiety, and mind-wandering, bringing attention to the present moment.",
      studies:
        "Mindfulness grounding techniques reduce anxiety by 58% and improve attention regulation by 40%. Grounding exercises decrease cortisol levels by 23% within 5 minutes and increase heart rate variability by 15%, indicating improved stress resilience.",
      biology:
        "Focused attention on sensory input activates the anterior cingulate cortex and insula, brain regions involved in present-moment awareness and interoception. This dampens amygdala reactivity and strengthens prefrontal-limbic connections for emotional regulation.",
    },
  },

  "Break free from laziness": {
    title: "Break Free from Laziness",
    icon: Zap,
    color: "from-blue-400 to-indigo-500",
    technique: "2-Minute Rule + Dopamine Activation",
    action: [
      "Choose the smallest possible version of your task (2 minutes max)",
      "Do 20 jumping jacks, push-ups, or burpees before starting",
      "Set a timer for exactly 2 minutes and begin the task",
      "Focus only on starting, not completing the entire project",
      "If motivated after 2 minutes, continue; if not, stop guilt-free",
      "Celebrate completion with a small reward or positive self-talk",
    ],
    science: {
      mechanism:
        "Physical movement increases dopamine, norepinephrine, and BDNF, priming the brain for action and motivation. The 2-minute rule overcomes the activation energy barrier by making tasks feel manageable and reducing the psychological resistance to starting.",
      studies:
        "Brief exercise increases dopamine by 25% and improves task initiation by 40%. Breaking tasks into 2-minute chunks reduces procrastination by 60% and increases completion rates by 300%. Movement before cognitive tasks improves performance by 20%.",
      biology:
        "Exercise activates the ventral tegmental area, releasing dopamine in the prefrontal cortex and nucleus accumbens. This enhances motivation and executive function while reducing activity in the anterior cingulate cortex associated with task aversion and procrastination.",
    },
  },

  "Reduce stress naturally": {
    title: "Reduce Stress Naturally",
    icon: Leaf,
    color: "from-green-400 to-emerald-500",
    technique: "Box Breathing + Progressive Muscle Relaxation",
    action: [
      "Sit comfortably and close your eyes",
      "Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4",
      "Repeat box breathing for 2-3 minutes",
      "Tense your toes for 5 seconds, then completely relax",
      "Work up your body: calves, thighs, glutes, abdomen, arms, face",
      "End with 5 deep breaths, noticing the relaxation throughout your body",
    ],
    science: {
      mechanism:
        "Box breathing activates the parasympathetic nervous system via vagal stimulation, reducing cortisol and activating the relaxation response. Progressive muscle relaxation reduces muscle tension and teaches the nervous system to distinguish between tension and relaxation states.",
      studies:
        "Box breathing reduces cortisol by 25% and anxiety by 44% in just 5 minutes. Progressive muscle relaxation decreases stress hormones by 30% and improves sleep quality by 35%. Combined techniques reduce blood pressure by 10-15 mmHg.",
      biology:
        "Controlled breathing stimulates the vagus nerve, activating the parasympathetic nervous system and releasing acetylcholine. This counters sympathetic stress responses, reduces norepinephrine release, and activates the prefrontal cortex for emotional regulation and stress resilience.",
    },
  },

  "Improve mental clarity": {
    title: "Improve Mental Clarity",
    icon: Brain,
    color: "from-purple-400 to-blue-500",
    technique: "Cognitive Enhancement Stack",
    action: [
      "Morning: 10 minutes meditation focusing on breath",
      "Hydrate: Drink 16-20oz water with pinch of sea salt",
      "Movement: 5 minutes of cross-lateral exercises (opposite arm/leg)",
      "Nutrition: Consume omega-3 rich foods (fish, walnuts, flax)",
      "Afternoon: 10-minute walk outside without devices",
      "Evening: Journal 3 things learned and 3 gratitudes",
    ],
    science: {
      mechanism:
        "Meditation increases gray matter density in attention and memory regions. Proper hydration maintains optimal neurotransmitter function. Cross-lateral movements enhance interhemispheric communication. Omega-3s support neuroplasticity and reduce neuroinflammation.",
      studies:
        "Daily meditation increases cortical thickness by 5% in attention areas within 8 weeks. Proper hydration improves cognitive performance by 12%. Cross-lateral exercises enhance executive function by 20% and omega-3 supplementation improves memory by 15%.",
      biology:
        "Meditation strengthens the anterior cingulate cortex and prefrontal regions involved in attention control. Hydration maintains optimal ion gradients for neural transmission. Cross-lateral movements activate the corpus callosum, enhancing bilateral brain communication and cognitive flexibility.",
    },
  },

  "Balance hormones": {
    title: "Balance Hormones",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    technique: "Circadian Hormone Optimization",
    action: [
      "Morning: Get sunlight within 30 minutes of waking",
      "Exercise: 20-30 minutes strength training 3x per week",
      "Nutrition: Eat protein within 1 hour of waking",
      "Stress: Practice 10 minutes daily meditation or breathwork",
      "Sleep: Maintain consistent sleep/wake times (±30 minutes)",
      "Avoid: Blue light 2 hours before bed, use red light instead",
    ],
    science: {
      mechanism:
        "Morning light optimizes cortisol awakening response and melatonin production. Resistance training increases growth hormone and testosterone. Protein provides amino acids for neurotransmitter synthesis. Consistent sleep timing regulates all hormonal rhythms.",
      studies:
        "Morning light therapy improves cortisol patterns by 40% and increases testosterone by 15%. Resistance training boosts growth hormone by 200-500% and improves insulin sensitivity by 25%. Consistent sleep timing optimizes all circadian hormone release.",
      biology:
        "Light exposure synchronizes the hypothalamic-pituitary-adrenal axis, optimizing cortisol, growth hormone, and sex hormone release. Exercise stimulates the hypothalamic-pituitary-gonadal axis, while consistent sleep timing maintains proper circadian hormone oscillations throughout the 24-hour cycle.",
    },
  },

  "Mindful meditation": {
    title: "Mindful Meditation",
    icon: Brain,
    color: "from-indigo-400 to-purple-500",
    technique: "Focused Attention Meditation",
    action: [
      "Sit comfortably with spine straight, eyes closed or soft gaze",
      "Focus attention on your breath at the nostrils",
      "When mind wanders, gently return attention to breath",
      "Start with 5 minutes, gradually increase to 20 minutes",
      "Practice same time daily for consistency",
      "Use guided apps initially: Headspace, Calm, or Insight Timer",
    ],
    science: {
      mechanism:
        "Focused attention meditation strengthens the anterior cingulate cortex and prefrontal regions involved in attention control and emotional regulation. Regular practice increases gray matter density and enhances default mode network regulation.",
      studies:
        "8 weeks of meditation increases cortical thickness by 5% in attention areas and reduces amygdala reactivity by 50%. Meditation improves sustained attention by 30%, reduces anxiety by 60%, and increases emotional regulation by 40%.",
      biology:
        "Meditation enhances gamma wave activity and increases GABA production, promoting calm alertness. It strengthens the insula for interoceptive awareness and reduces default mode network activity associated with rumination and self-referential thinking.",
    },
  },

  "Digital detox": {
    title: "Digital Detox",
    icon: Leaf,
    color: "from-green-400 to-teal-500",
    technique: "Structured Screen Time Reduction",
    action: [
      "Morning: No screens for first 60 minutes after waking",
      "Work: Use 25-minute focused work blocks with 5-minute screen breaks",
      "Meals: Eat without any digital devices present",
      "Evening: All screens off 2 hours before bedtime",
      "Weekend: Designate 4-6 hour screen-free periods",
      "Replace: Have physical books, puzzles, or outdoor activities ready",
    ],
    science: {
      mechanism:
        "Excessive screen time disrupts dopamine regulation, impairs attention span, and interferes with circadian rhythms via blue light exposure. Digital detox allows dopamine receptors to resensitize and restores natural attention and reward systems.",
      studies:
        "Digital detox for 1 week improves attention span by 25% and sleep quality by 30%. Reduced screen time increases face-to-face social interaction by 40% and improves mood scores by 20%. Blue light reduction improves melatonin production by 35%.",
      biology:
        "Constant digital stimulation leads to dopamine desensitization and attention residue. Screen breaks allow the prefrontal cortex to reset and the default mode network to process information. Reduced blue light exposure optimizes circadian melatonin production.",
    },
  },

  "Forest bathing": {
    title: "Forest Bathing",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    technique: "Shinrin-yoku Nature Immersion",
    action: [
      "Spend 2+ hours in a forest or natural setting weekly",
      "Walk slowly and mindfully, engaging all senses",
      "Touch tree bark, smell the air, listen to natural sounds",
      "Sit quietly for 10-15 minutes, breathing deeply",
      "Leave devices behind or keep them on airplane mode",
      "Focus on being present rather than exercising or achieving goals",
    ],
    science: {
      mechanism:
        "Forest environments contain phytoncides (antimicrobial compounds) that boost immune function. Natural settings reduce cortisol, lower blood pressure, and activate the parasympathetic nervous system. Green spaces enhance attention restoration and reduce mental fatigue.",
      studies:
        "Forest bathing increases NK (natural killer) immune cells by 50% for up to 30 days. Nature exposure reduces cortisol by 15%, blood pressure by 5-10 mmHg, and improves mood scores by 50%. Attention restoration improves by 20% after nature exposure.",
      biology:
        "Phytoncides from trees enhance immune function by increasing NK cell activity and anti-cancer proteins. Natural fractals and green wavelengths activate the parasympathetic nervous system, while reduced urban stressors allow the prefrontal cortex to recover from directed attention fatigue.",
    },
  },
}
