(function (global) {
const company = {
  name: "MediHelp",
  legal: "MediHelp Surgical Pvt. Ltd.",
  tagline: "Surgical & Medical Equipment",
  statement: "Precision machines. Hospital-grade support.",
  phone: "+91 22 4567 8900",
  phoneHref: "tel:+912245678900",
  whatsapp: "https://wa.me/912245678900",
  email: "sales@medihelp.in",
  emailHref: "mailto:sales@medihelp.in",
  hours: "Mon–Sat, 9:30 AM – 6:30 PM IST",
  address: "14th Floor, Horizon Towers, Bandra Kurla Complex, Mumbai 400051",
  serviceHub: "National Service Hub — Sector 44, Gurugram 122003",
  gst: "27AABCM0000A1Z5",
};

const nav = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/categories" },
  { label: "Why MediHelp", to: "/about" },
  { label: "Service", to: "/service" },
  { label: "Contact", to: "/contact" },
];

const stats = [
  { value: "18+", label: "Years supplying OT & ICU" },
  { value: "420+", label: "Hospitals & clinics served" },
  { value: "6", label: "Surgical specialities" },
  { value: "48 hr", label: "Critical-part response" },
];

const reasons = [
  {
    title: "Speciality-first catalog",
    copy: "Machines are grouped the way theatres actually buy — neuro, cardio, dental, ortho, general surgery — not a generic warehouse dump.",
  },
  {
    title: "Installation & OT commissioning",
    copy: "Factory-trained engineers handle unboxing, calibration, staff orientation and first-case support in your theatre.",
  },
  {
    title: "Warranty you can call",
    copy: "Standard 12–24 month warranty with optional AMC / CMC. Service tickets are logged against serial numbers, not guesswork.",
  },
  {
    title: "Accessories & consumables",
    copy: "Handpieces, drapes, probes and sterilisation trays are listed per machine so you can quote a complete workcell, not a lonely box.",
  },
];

const categories = [
  {
    slug: "neuro",
    name: "Neuro / Neurosurgery",
    emoji: "🫀",
    short: "Microscopes, cranial drills and endoscopic visualisation for cranial and spine theatres.",
    intro:
      "Neurosurgical platforms selected for optical clarity, low-vibration cutting and stable visualisation during long cranial and spine cases.",
  },
  {
    slug: "cardio",
    name: "Cardio / Cardiovascular",
    emoji: "❤️",
    short: "Perfusion, circulatory support and emergency cardiac response systems.",
    intro:
      "Cardiovascular equipment for cardiac OT, cath lab backup and ICU — from heart-lung support to defibrillation.",
  },
  {
    slug: "dental",
    name: "Dental",
    emoji: "🦷",
    short: "Treatment units, intraoral scanning and implant motors for clinics and hospital dental OTs.",
    intro:
      "Dental systems for hospital departments and high-volume clinics, with infection-control and implant workflow in mind.",
  },
  {
    slug: "ortho",
    name: "Ortho / Orthopaedic",
    emoji: "🦴",
    short: "C-arms, power tools and arthroscopy towers for trauma and joint reconstruction.",
    intro:
      "Orthopaedic imaging and power systems built for trauma, arthroplasty and sports medicine theatres.",
  },
  {
    slug: "general-surgery",
    name: "General Surgery",
    emoji: "🏥",
    short: "OT lights, laparoscopy, electrosurgery and anaesthesia workstations.",
    intro:
      "Core operating-theatre infrastructure used across general, GI, gynae and day-care surgery.",
  },
  {
    slug: "other",
    name: "Other medical equipment",
    emoji: "🔬",
    short: "Monitors, sterilisation, infusion and ultrasound for wards, ICU and CSSD.",
    intro:
      "Supporting medical equipment that keeps theatres, ICU and CSSD running — monitoring, sterilisation, infusion and imaging.",
  },
];

const img = {
  or: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80",
  surgery: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1400&q=80",
  team: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80",
  microscope: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1400&q=80",
  lab: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1400&q=80",
  dental: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1400&q=80",
  dental2: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1400&q=80",
  heart: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1400&q=80",
  monitor: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80",
  tools: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1400&q=80",
  clinic: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
  hands: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
  lights: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
  ward: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=1400&q=80",
  tech: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1400&q=80",
  sterile: "https://images.unsplash.com/photo-1581595220892-b0739db3b8c5?auto=format&fit=crop&w=1400&q=80",
};

const products = [
  {
    slug: "helixview-ns-900",
    name: "HelixView NS-900",
    model: "NS-900",
    category: "neuro",
    featured: true,
    image: img.surgery,
    intro:
      "Floor-stand surgical microscope for cranial, spine and ENT-adjacent neurosurgery, with apochromatic optics and electromagnetic brakes for long, still cases.",
    features: [
      "Apochromatic optics with 6:1 zoom and 200–400 mm variable working distance",
      "LED illumination with redundant lamp path and automatic iris",
      "Electromagnetic brakes on all major joints; one-touch balance",
      "Optional 4K camera and recording head for teaching theatres",
      "Face-to-face binoculars for assistant visualisation",
    ],
    specs: [
      ["Optics", "Apochromatic, 6:1 zoom"],
      ["Working distance", "200–400 mm"],
      ["Illumination", "Dual LED, 50,000 hour rated"],
      ["Stand", "Floor, electromagnetic brakes"],
      ["Camera", "Optional 4K HDMI / USB"],
      ["Power", "100–240 V, 50/60 Hz"],
    ],
    applications: [
      "Cranial tumour and vascular microsurgery",
      "Cervical and lumbar decompression",
      "Microvascular anastomosis",
      "Teaching hospitals requiring recording",
    ],
    accessories: [
      "Sterile drape kits (box of 20)",
      "Assistant binocular module",
      "4K camera & recording kit",
      "Mouth-switch and foot-switch set",
    ],
    warranty:
      "24 months on optics and stand. LED modules 12 months. Annual preventive visit included in year one. AMC available from month 13.",
  },
  {
    slug: "craniodrill-cd-450",
    name: "CranioDrill CD-450",
    model: "CD-450",
    category: "neuro",
    featured: true,
    image: img.tools,
    intro:
      "High-speed cranial drill and perforator system with dual motors, irrigation and a full craniotomy burr library for adult and paediatric neurosurgery.",
    features: [
      "Dual-motor console: high-speed drill plus low-speed perforator",
      "Integrated saline irrigation with adjustable drip",
      "Quick-release handpieces, autoclavable",
      "Torque-limited perforator for safer bur-hole work",
      "Quiet console suitable for long cranial lists",
    ],
    specs: [
      ["High-speed range", "Up to 80,000 rpm"],
      ["Perforator", "Torque-limited, 0–1,200 rpm"],
      ["Irrigation", "Integrated pump, 5–40 ml/min"],
      ["Handpieces", "Straight, angled, micro"],
      ["Sterilisation", "Steam 134 °C, 18 min"],
      ["Console weight", "8.4 kg"],
    ],
    applications: [
      "Craniotomy and craniectomy",
      "Bur-hole drainage",
      "Spine bone work (selected bits)",
      "Paediatric neurosurgery with micro handpiece",
    ],
    accessories: [
      "Adult & paediatric perforator bits",
      "Craniotome and match-head burrs",
      "Irrigation tubing set",
      "Sterilisation tray",
    ],
    warranty:
      "12 months console and motors. Cutting accessories are consumable. Loaner console available under AMC.",
  },
  {
    slug: "neuroscope-ne-3d",
    name: "NeuroScope NE-3D",
    model: "NE-3D",
    category: "neuro",
    featured: false,
    image: img.lab,
    intro:
      "Neuroendoscopic visualisation tower with 4K camera, light source and rigid endoscope set for ventricular, skull-base and spine endoscopy.",
    features: [
      "4K camera head with native 3840×2160 output",
      "LED light source, 0–100% intensity, low heat at the tip",
      "Rigid endoscope set: 0°, 30°, 45°",
      "Picture-in-picture and still-capture on foot pedal",
      "DICOM-ready USB export for PACS",
    ],
    specs: [
      ["Resolution", "4K UHD"],
      ["Light source", "LED, 30,000 hour"],
      ["Scopes", "2.7 mm / 4 mm rigid"],
      ["Monitor", "32-inch medical grade"],
      ["Recording", "USB / optional NAS"],
      ["Cart", "Medical-grade, isolation transformer"],
    ],
    applications: [
      "Endoscopic third ventriculostomy",
      "Intraventricular tumour biopsy",
      "Selected skull-base approaches",
      "Endoscopic spine assistance",
    ],
    accessories: [
      "Rigid endoscope set (3 angles)",
      "Camera drape pack",
      "Light-guide cables",
      "Instrument tray for working channels",
    ],
    warranty:
      "24 months camera and light source. Scopes 12 months against manufacturing defect. Service at Gurugram hub.",
  },
  {
    slug: "cardioflow-hl-800",
    name: "CardioFlow HL-800",
    model: "HL-800",
    category: "cardio",
    featured: true,
    image: img.heart,
    intro:
      "Modular heart-lung / perfusion console for adult and paediatric cardiac surgery, with roller and centrifugal pump options and continuous safety monitoring.",
    features: [
      "Up to five pump stations; roller or centrifugal modules",
      "Level, bubble and pressure sensors with audible-visual alarm",
      "Heater-cooler interface and cardioplegia module",
      "Touch console with case logging and USB export",
      "Battery backup for pump continuity during mains drop",
    ],
    specs: [
      ["Pump stations", "5 modular"],
      ["Flow range", "0.1–8.0 L/min"],
      ["Sensors", "Level, bubble, pressure, temp"],
      ["Battery", "≥ 45 min designated pumps"],
      ["Display", "15-inch touch"],
      ["Cart", "Locking casters, IV pole mounts"],
    ],
    applications: [
      "On-pump CABG and valve surgery",
      "Paediatric congenital lists (with paediatric pack)",
      "Selected ECMO bridge configurations (protocol dependent)",
      "Teaching perfusion programmes",
    ],
    accessories: [
      "Adult & paediatric tubing packs",
      "Oxygenator mounting kit",
      "Cardioplegia module",
      "Heater-cooler hoses",
    ],
    warranty:
      "24 months console. Pump heads per manufacturer cycle. Perfusionist training included at commissioning. CMC recommended.",
  },
  {
    slug: "pulseguard-iabp-200",
    name: "PulseGuard IABP-200",
    model: "IABP-200",
    category: "cardio",
    featured: false,
    image: img.monitor,
    intro:
      "Intra-aortic balloon pump for cardiogenic shock and high-risk PCI / cardiac surgery weaning, with fibre-optic timing and compact ICU footprint.",
    features: [
      "ECG and pressure trigger with automatic timing assist",
      "Fibre-optic catheter compatible channel",
      "Compact tower for ICU and cath-lab transfer",
      "Helium management with leak detection",
      "Battery for intra-hospital transport",
    ],
    specs: [
      ["Trigger", "ECG, pressure, internal"],
      ["Balloon sizes", "25–50 cc (catalogued)"],
      ["Battery", "Up to 2 hours"],
      ["Display", "Waveforms + timing overlay"],
      ["Gas", "Medical helium cylinder interface"],
      ["Weight", "32 kg including cart"],
    ],
    applications: [
      "Cardiogenic shock support",
      "High-risk PCI standby",
      "Weaning from cardiopulmonary bypass",
      "Intra-hospital transfer of ballooned patients",
    ],
    accessories: [
      "IAB catheter set (selected sizes)",
      "ECG cable pack",
      "Helium regulator kit",
      "Transport battery",
    ],
    warranty:
      "12 months console. Catheters are single-use. On-site in-service for ICU and cath-lab nursing included.",
  },
  {
    slug: "defibpro-dp-360",
    name: "DefibPro DP-360",
    model: "DP-360",
    category: "cardio",
    featured: true,
    image: img.clinic,
    intro:
      "Biphasic defibrillator-monitor for OT, ICU and emergency, with AED mode, pacing and a bright display readable under surgical lights.",
    features: [
      "Biphasic truncated exponential waveform up to 360 J",
      "Manual, AED and synchronized cardioversion modes",
      "Transcutaneous pacing",
      "SpO₂ and NIBP options",
      "Event summary print and USB case export",
    ],
    specs: [
      ["Energy", "1–360 J biphasic"],
      ["Modes", "Manual / AED / sync / pace"],
      ["Display", "8.4-inch colour"],
      ["Battery", "Dual Li-ion, hot-swap"],
      ["Printer", "50 mm thermal"],
      ["IP rating", "IP44 on main unit"],
    ],
    applications: [
      "Cardiac OT and recovery",
      "ICU crash trolleys",
      "Emergency department",
      "Cath-lab standby",
    ],
    accessories: [
      "Adult & paediatric paddles",
      "Multifunction pads",
      "SpO₂ / NIBP modules",
      "Wall mount and crash-cart bracket",
    ],
    warranty:
      "24 months unit. Batteries 12 months. Annual calibration certificate available under AMC.",
  },
  {
    slug: "dentachair-dc-elite",
    name: "DentaChair DC-Elite",
    model: "DC-Elite",
    category: "dental",
    featured: true,
    image: img.dental,
    intro:
      "Hospital-grade dental treatment unit with seamless upholstery, dual-water circuit and an assistant module designed for oral surgery as well as restorative lists.",
    features: [
      "Programmable chair positions including Trendelenburg",
      "Fibre-optic turbine, micromotor and scaler points",
      "Independent clean-water bottle plus city-water option",
      "LED operating light with sensor on/off",
      "Ambidextrous delivery arm for four-handed dentistry",
    ],
    specs: [
      ["Chair load", "180 kg"],
      ["Delivery", "Over-the-patient, 5 points"],
      ["Light", "LED, 8,000–32,000 lux"],
      ["Suction", "High & low volume"],
      ["Upholstery", "Seamless medical vinyl"],
      ["Power", "230 V, 50 Hz"],
    ],
    applications: [
      "Hospital dental OT and OPD",
      "Oral surgery under LA",
      "Restorative and endodontic lists",
      "Teaching clinics",
    ],
    accessories: [
      "Stool pair (operator + assistant)",
      "Scaler handpiece",
      "Curing light holder",
      "Cuspidor and suction filters pack",
    ],
    warranty:
      "24 months chair mechanics and delivery. Upholstery 12 months. Preventive service at 6 months included.",
  },
  {
    slug: "scanintra-si-500",
    name: "ScanIntra SI-500",
    model: "SI-500",
    category: "dental",
    featured: false,
    image: img.dental2,
    intro:
      "Powder-free intraoral scanner for crown, implant and orthodontic workflows, with full-arch stitching and STL / PLY export to your lab.",
    features: [
      "Powder-free optical scanning",
      "Full-arch in a single continuous pass",
      "Anti-fog tips, autoclavable",
      "Colour texture for margin visualisation",
      "Open STL / PLY / OBJ export",
    ],
    specs: [
      ["Accuracy", "≤ 20 µm (in-vitro crown)"],
      ["Tips", "Autoclavable, 2 sizes"],
      ["Export", "STL, PLY, OBJ"],
      ["Laptop", "Medical cart optional"],
      ["Calibration", "Field calibrator included"],
      ["Weight (wand)", "240 g"],
    ],
    applications: [
      "Crown and bridge impressions",
      "Implant scan-bodies",
      "Ortho aligner records",
      "In-house milling workflows",
    ],
    accessories: [
      "Tip pack (standard + small)",
      "Calibration kit",
      "Cart with isolation transformer",
      "Lab export dongle",
    ],
    warranty:
      "12 months scanner. Tips are consumable. Software updates for 24 months from installation.",
  },
  {
    slug: "implantdrive-id-70",
    name: "ImplantDrive ID-70",
    model: "ID-70",
    category: "dental",
    featured: false,
    image: img.hands,
    intro:
      "Implant motor with torque control, physio-dispenser and a 20:1 surgical contra-angle for hospital oral surgery and implantology.",
    features: [
      "Torque control 5–70 Ncm with on-screen graph",
      "Physio irrigation pump, adjustable",
      "20:1 surgical contra-angle, fibre-optic",
      "Programmable sequences for osteotomy steps",
      "Sterilisable motor sleeve",
    ],
    specs: [
      ["Torque", "5–70 Ncm"],
      ["Speed (20:1)", "15–2,000 rpm"],
      ["Irrigation", "4 rollers, 10–100 ml/min"],
      ["Handpiece", "20:1 FO, ISO latch"],
      ["Display", "Colour, glove-friendly"],
      ["Pedal", "Multifunction, IPX8"],
    ],
    applications: [
      "Dental implant osteotomy",
      "Sinus and bone-graft assistance",
      "Hospital oral surgery",
      "Teaching implant programmes",
    ],
    accessories: [
      "20:1 contra-angle",
      "Irrigation tubing set",
      "Motor sterilisation sleeve",
      "Surgical cassette",
    ],
    warranty:
      "24 months console. Handpiece 12 months. Calibration check at 12 months included.",
  },
  {
    slug: "orthoarm-oa-c9",
    name: "OrthoArm OA-C9",
    model: "OA-C9",
    category: "ortho",
    featured: true,
    image: img.tech,
    intro:
      "Compact mobile C-arm for trauma, nailing and pain procedures, with pulsed fluoro, last-image-hold and a dual-monitor trolley that fits crowded Indian OTs.",
    features: [
      "9-inch image intensifier with digital processing",
      "Pulsed fluoroscopy to reduce dose",
      "Last-image-hold and cine loop",
      "Dual 19-inch medical monitors on trolley",
      "Laser localiser and compact footprint",
    ],
    specs: [
      ["II", "9-inch"],
      ["kV / mA", "40–110 kV / pulsed mA"],
      ["SID", "970 mm"],
      ["Orbital rotation", "± 135°"],
      ["Monitors", "Dual 19-inch"],
      ["Power", "230 V, 16 A recommended"],
    ],
    applications: [
      "Trauma nailing and plating",
      "Hip and knee arthroplasty checks",
      "Pain and spine injections",
      "Urology / general fluoro overflow",
    ],
    accessories: [
      "Sterile C-arm drapes",
      "Laser localiser",
      "Printer / USB capture",
      "Lead apron set (optional quote)",
    ],
    warranty:
      "12 months X-ray generator and II. AERB documentation support for installation. AMC includes tube-hour review.",
  },
  {
    slug: "powerortho-po-x4",
    name: "PowerOrtho PO-X4",
    model: "PO-X4",
    category: "ortho",
    featured: true,
    image: img.tools,
    intro:
      "Battery orthopaedic power system — drill, reamer, sagittal saw and reciprocating saw — with autoclave-ready handpieces and colour-coded batteries.",
    features: [
      "Four handpiece family on one battery platform",
      "Autoclavable handpieces, sealed electronics",
      "High-capacity Li-ion batteries, 20-minute charge",
      "Sagittal and reciprocating saws for arthroplasty and trauma",
      "Cannulated drill for wiring and nailing",
    ],
    specs: [
      ["Handpieces", "Drill, reamer, sagittal, recip"],
      ["Battery", "Li-ion, ~20 min charge"],
      ["Sterilisation", "134 °C steam"],
      ["Charger", "4-bay, status LEDs"],
      ["Noise", "Low-vibration motors"],
      ["Case", "Perforated sterilisation case"],
    ],
    applications: [
      "Trauma plating and nailing",
      "Knee and hip arthroplasty",
      "Sports / small-bone with micro drill",
      "Emergency OT standby set",
    ],
    accessories: [
      "4-bay charger",
      "Battery pack (×4 recommended)",
      "Saw blades starter kit",
      "Sterilisation case",
    ],
    warranty:
      "24 months handpieces. Batteries 12 months or cycle-limited, whichever first. Blade stock available on standing order.",
  },
  {
    slug: "arthrotower-at-4k",
    name: "ArthroTower AT-4K",
    model: "AT-4K",
    category: "ortho",
    featured: false,
    image: img.surgery,
    intro:
      "4K arthroscopy tower with camera, LED light, pump and shaver console for knee, shoulder and small-joint sports medicine.",
    features: [
      "4K camera with native UHD output",
      "LED light source with auto-shutter",
      "Inflow/outflow pump with pressure sensing",
      "Shaver console with dual handpiece ports",
      "Medical cart with isolation transformer",
    ],
    specs: [
      ["Camera", "4K UHD"],
      ["Light", "LED"],
      ["Pump", "Pressure-controlled"],
      ["Shaver", "Dual port, 0–12,000 rpm"],
      ["Scopes", "4 mm 30° / 70° recommended"],
      ["Monitor", "32-inch 4K medical"],
    ],
    applications: [
      "Knee arthroscopy and ACL lists",
      "Shoulder instability and cuff",
      "Ankle and wrist small-joint",
      "Day-care sports medicine centres",
    ],
    accessories: [
      "Arthroscope set 30° / 70°",
      "Shaver blades starter pack",
      "Pump tubing",
      "Camera drapes",
    ],
    warranty:
      "24 months tower electronics. Scopes 12 months. Blade and tubing consumable. OT in-service included.",
  },
  {
    slug: "lumenot-lt-led",
    name: "LumenOT LT-LED",
    model: "LT-LED",
    category: "general-surgery",
    featured: true,
    image: img.lights,
    intro:
      "Dual-dome LED surgical light with high CRI, low heat and a sterile-handle camera option for general, gynae and neuro overflow theatres.",
    features: [
      "Dual dome, 160,000 lux each at 1 m",
      "CRI ≥ 95, adjustable colour temperature",
      "Endo mode for laparoscopic ambient",
      "Sterilisable handles, wall-mount or ceiling",
      "Optional HD camera in central handle",
    ],
    specs: [
      ["Illuminance", "160,000 lux / dome"],
      ["CRI", "≥ 95"],
      ["Colour temp", "3,500–5,000 K"],
      ["Depth of field", "Deep-cavity pattern"],
      ["Mount", "Ceiling dual-arm"],
      ["Power", "100–240 V"],
    ],
    applications: [
      "General and GI surgery",
      "Gynae and obstetric OT",
      "Trauma theatres",
      "Hybrid / teaching OT with camera",
    ],
    accessories: [
      "Sterile handle pack",
      "HD camera module",
      "Wall control panel",
      "UPS interface",
    ],
    warranty:
      "36 months LED engines. Arms and brakes 24 months. Site survey before ceiling install is mandatory.",
  },
  {
    slug: "laparovision-lv-4k",
    name: "LaparoVision LV-4K",
    model: "LV-4K",
    category: "general-surgery",
    featured: true,
    image: img.or,
    intro:
      "Complete 4K laparoscopy stack — camera, light, insufflator, electrosurgery interface and monitor — for general, gynae and bariatric lists.",
    features: [
      "4K camera head, native UHD",
      "50 L/min insufflator with smoke evacuation port",
      "LED light, low heat",
      "Picture-in-picture for fluorescence-ready upgrade path",
      "Medical cart with CO₂ cylinder brackets",
    ],
    specs: [
      ["Camera", "4K UHD"],
      ["Insufflator", "50 L/min, 0–30 mmHg"],
      ["Light", "LED"],
      ["Monitor", "32-inch 4K"],
      ["Scopes", "10 mm 0° / 30°"],
      ["Recording", "USB 4K optional"],
    ],
    applications: [
      "Laparoscopic cholecystectomy and hernia",
      "Gynae laparoscopy",
      "Bariatric (high-flow CO₂)",
      "Teaching OT recording",
    ],
    accessories: [
      "10 mm laparoscope 0° & 30°",
      "Light cable",
      "Insufflation tubing",
      "Camera drape box",
    ],
    warranty:
      "24 months stack. Scopes 12 months. Insufflator filters consumable. Commissioning includes leak and flow checks.",
  },
  {
    slug: "electrocut-ec-400",
    name: "ElectroCut EC-400",
    model: "EC-400",
    category: "general-surgery",
    featured: false,
    image: img.team,
    intro:
      "400 W electrosurgical generator with monopolar, bipolar and vessel-sealing modes, plus a dual-pedal and return-electrode monitoring for safety.",
    features: [
      "Monopolar cut/coag and bipolar",
      "Vessel-sealing mode on compatible instruments",
      "Return electrode contact quality monitoring",
      "Nine programmable surgeon presets",
      "Smoke-evacuator trigger output",
    ],
    specs: [
      ["Power", "400 W max (mode dependent)"],
      ["Modes", "Cut, blend, coag, bipolar, seal"],
      ["REM", "Yes, dual-pad"],
      ["Pedal", "Dual, waterproof"],
      ["Display", "Colour, alarm codes"],
      ["Cooling", "Fan, OT-quiet"],
    ],
    applications: [
      "Open general surgery",
      "Laparoscopy (with compatible pencils)",
      "Gynae and urology lists",
      "Day-care OT",
    ],
    accessories: [
      "Monopolar pencil pack",
      "Patient return pads",
      "Bipolar forceps",
      "Vessel-sealing instrument (optional)",
    ],
    warranty:
      "24 months generator. Accessories per pack labelling. Biomedical training for diathermy safety included.",
  },
  {
    slug: "anesthiapro-aw-900",
    name: "AnesthiaPro AW-900",
    model: "AW-900",
    category: "general-surgery",
    featured: false,
    image: img.ward,
    intro:
      "Anaesthesia workstation with electronic gas mixing, ventilator modes for adult and paediatric, and a full agent bench for modern OT lists.",
    features: [
      "Electronic mixer with hypoxic guard",
      "Volume, pressure and SIMV ventilator modes",
      "Integrated agent bench (isoflurane / sevoflurane ready)",
      "Spirometry and gas module options",
      "UPS-friendly power profile",
    ],
    specs: [
      ["Ventilation", "VCV, PCV, SIMV, manual"],
      ["Tidal volume", "20–1500 ml"],
      ["Gases", "O₂, N₂O, Air"],
      ["Vaporizers", "Selectatec-compatible"],
      ["Display", "15-inch touch"],
      ["Battery", "≥ 60 min ventilator"],
    ],
    applications: [
      "General OT anaesthesia",
      "Paediatric lists (with bellows kit)",
      "Day-care surgery",
      "Emergency OT",
    ],
    accessories: [
      "Adult & paediatric circuits",
      "Vaporizer (sevoflurane)",
      "Gas module",
      "AGSS interface",
    ],
    warranty:
      "24 months workstation. Vaporizers 12 months. Annual calibration under AMC. Pipeline survey recommended before install.",
  },
  {
    slug: "vitamon-vm-12",
    name: "VitaMon VM-12",
    model: "VM-12",
    category: "other",
    featured: true,
    image: img.monitor,
    intro:
      "12-inch multiparameter patient monitor for OT, recovery and ICU, with ECG, SpO₂, NIBP, temperature and optional EtCO₂ / IBP.",
    features: [
      "6-lead ECG with arrhythmia assist",
      "Masimo-compatible SpO₂ option path",
      "NIBP with adult, paediatric, neonatal cuffs",
      "Optional sidestream EtCO₂ and dual IBP",
      "72-hour tabular and graphic trends",
    ],
    specs: [
      ["Screen", "12-inch touch"],
      ["Parameters", "ECG, SpO₂, NIBP, TEMP"],
      ["Options", "EtCO₂, IBP ×2"],
      ["Alarms", "Visual + auditory, latching"],
      ["Network", "HL7 / optional central"],
      ["Battery", "4 hours typical"],
    ],
    applications: [
      "OT and PACU",
      "ICU and HDU",
      "Emergency bays",
      "Ward step-down",
    ],
    accessories: [
      "ECG cable and electrodes",
      "SpO₂ probe (adult)",
      "NIBP cuff set",
      "Wall mount / rolling stand",
    ],
    warranty:
      "24 months monitor. Probes and cuffs 6–12 months. Central station quoted separately.",
  },
  {
    slug: "sterimax-sm-23",
    name: "SteriMax SM-23",
    model: "SM-23",
    category: "other",
    featured: false,
    image: img.sterile,
    intro:
      "23-litre Class B vacuum autoclave for CSSD satellite stations, dental OT and implant cassettes, with Bowie-Dick and helix test cycles.",
    features: [
      "Class B fractionated vacuum",
      "Bowie-Dick, helix and vacuum-test cycles",
      "USB cycle archive for audits",
      "Closed-door drying",
      "Water-quality warning",
    ],
    specs: [
      ["Chamber", "23 L, stainless"],
      ["Class", "B (EN 13060 analog)"],
      ["Cycles", "121 / 134 °C + tests"],
      ["Trays", "3 stainless"],
      ["Data", "USB cycle log"],
      ["Power", "230 V, 16 A"],
    ],
    applications: [
      "Dental and implant cassette sterilisation",
      "OT instrument overflow",
      "Day-care CSSD satellite",
      "Clinic CSSD",
    ],
    accessories: [
      "Tray set",
      "Helix test pack starter",
      "Printer (optional)",
      "Water demineraliser",
    ],
    warranty:
      "12 months chamber and vacuum pump. Gaskets consumable. IQ/OQ documentation pack available.",
  },
  {
    slug: "infusecare-ic-smart",
    name: "InfuseCare IC-Smart",
    model: "IC-Smart",
    category: "other",
    featured: false,
    image: img.clinic,
    intro:
      "Volumetric infusion pump with drug library, dual-channel option and occlusion sensing for ICU, OT and chemo day-care.",
    features: [
      "Drug library with soft/hard limits",
      "Occlusion, air-in-line and door-open alarms",
      "Battery for transfer",
      "Stackable dual-channel configuration",
      "Night mode for ICU",
    ],
    specs: [
      ["Rate", "0.1–1200 ml/h"],
      ["Accuracy", "± 5% typical"],
      ["Alarms", "Occlusion, air, door, battery"],
      ["Battery", "≥ 4 hours"],
      ["IP", "IP24"],
      ["Pole clamp", "Universal"],
    ],
    applications: [
      "ICU infusions",
      "OT maintenance fluids",
      "Chemo day-care (protocol dependent)",
      "Paediatric with micro-set",
    ],
    accessories: [
      "Dedicated administration sets",
      "Pole clamp",
      "Dual-channel locker",
      "Drug-library programming service",
    ],
    warranty:
      "24 months pump. Sets single-use. Drug-library workshop included at go-live.",
  },
  {
    slug: "echoprobe-ep-hd",
    name: "EchoProbe EP-HD",
    model: "EP-HD",
    category: "other",
    featured: false,
    image: img.hands,
    intro:
      "Cart-based ultrasound with convex, linear and cardiac probes for OT regional anaesthesia, FAST and bedside echo.",
    features: [
      "15-inch high-brightness display",
      "Convex, linear and phased-array probe ports",
      "Needle-enhance mode for blocks",
      "DICOM and USB export",
      "Battery + cart for OT and ICU rounds",
    ],
    specs: [
      ["Display", "15-inch HD"],
      ["Probes", "Convex, linear, cardiac"],
      ["Modes", "B, C, PW, M"],
      ["Export", "DICOM, USB, JPG"],
      ["Battery", "60 min scanning"],
      ["Cart", "Height-adjust, probe holders"],
    ],
    applications: [
      "Regional anaesthesia in OT",
      "FAST / eFAST in emergency",
      "Bedside cardiac screening",
      "ICU vascular access",
    ],
    accessories: [
      "Linear probe (high-frequency)",
      "Convex probe",
      "Phased-array probe",
      "Printer and gel warmer",
    ],
    warranty:
      "24 months system. Probes 12 months. Probe care training at installation.",
  },
];

function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}

function getProductsByCategory(slug) {
  return products.filter((p) => p.category === slug);
}

function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

function getFeatured() {
  return products.filter((p) => p.featured);
}

function getRelated(product, limit = 3) {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

global.MH = {
  company, nav, stats, reasons, categories, products,
  getCategory, getProductsByCategory, getProduct, getFeatured, getRelated
};
})(window);
