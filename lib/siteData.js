const company = {
  name: "PSP Engineering",
  legalName: "PSP Engineering Limited",
  phone: "(09) 624-1004",
  phoneIntl: "+64 9 624 1004",
  fax: "(09) 624-2449",
  faxIntl: "+64 9 624 2449",
  email: "office@pspengineering.co.nz",
  website: "pspengineering.co.nz",
  street: ["44 Carr Road", "Mount Roskill", "Auckland City", "Auckland 1041"],
  postal: ["P O Box 27085", "Mount Roskill", "Auckland City", "Auckland 1440"],
  hours: "Mon - Fri 7:30am - 5:00pm",
};

const services = [
  {
    slug: "multitasking-5-axis",
    name: "MultiTasking 5+ Axis",
    short: "5+ axis machining opens up efficient production for complex, high-accuracy parts in a single setup.",
    intro: "5+ axis machining provides infinite possibilities as to the part sizes and shapes you can effectively process.",
    image: "/public/img/multitasking.jpg",
    body: [
      "The term 5-axis refers to the number of directions in which the cutting tool can move. On a 5-axis machining center, the tool moves across the X, Y and Z linear axes while also rotating on the A and B axes so the workpiece can be approached from almost any direction.",
      "Multi-tasking machines are extremely effective because they can mill and turn part features with high accuracy and high quality while reducing the number of machines required and lowering labour cost per part.",
      "PSP can support everything from very small parts with short cycle times through to larger, more complex components that may require extended machining time.",
      "At the highest level of multi-tasking, specialised functions such as gear cutting, honing, grinding and polishing can be incorporated for demanding components and more automated production workflows.",
    ],
    highlight: "Ideal for complex, multi-face components that benefit from fewer setups.",
  },
  {
    slug: "cnc-machining",
    name: "CNC Machining",
    short: "Computer-controlled machining for precise, repeatable manufacturing across lathes, mills, routers, and grinders.",
    intro: "CNC Machining is a process used in the manufacturing sector that involves the use of computers to control machine tools.",
    image: "/public/img/cnc-machining.jpg",
    body: [
      "CNC refers to computer-automated machining, where a very specific and precise piece can be machined from metal using pre-programmed software.",
      "The process can control a range of equipment including lathes, mills, routers and grinders, allowing three-dimensional cutting tasks to be completed accurately and consistently.",
      "Compared with manual control, CNC machining improves repeatability and expands the complexity of parts that can be produced while reducing the risk of inconsistencies between runs.",
      "Because the machining logic is retained digitally, programs can be refined and reused, making CNC a practical choice for one-off parts as well as ongoing production work.",
    ],
    highlight: "Strong fit for precision parts, repeatable production, and tight tolerances.",
  },
  {
    slug: "3d-design",
    name: "3D Design",
    short: "Full 3D modelling and design services shaped by real-world machining knowledge and materials expertise.",
    intro: "PSP provides a full range of 3D modeling and design services for our clients, to produce the exact parts you need.",
    image: "/public/img/3d-design-example.jpg",
    body: [
      "A major advantage in designing with PSP is that the team thoroughly understands CNC machinery and can help design the most cost-effective parts with minimal raw material use and efficient programming time.",
      "Materials knowledge also plays an important role. PSP can help clients understand how varying configurations and thicknesses of aluminium or steel affect component strength, weight, and manufacturability.",
      "This design-led approach reduces waste, improves manufacturability, and creates better outcomes before production even begins.",
    ],
    highlight: "Design work informed by manufacturing reality, not just CAD theory.",
  },
  {
    slug: "custom-marine-manufacture",
    name: "Custom Marine Manufacture",
    short: "Custom marine components for yachting, racing boats, surf lifesaving boats, and fishing rigs.",
    intro: "PSP often designs custom components for marine use, including yachting, racing boats, surf lifesaving boats, and fishing rigs.",
    image: "/public/img/Custom-Marine-Manufacture.jpg",
    body: [
      "Auckland is world famous as the city of sails and has a strong marine industry, making custom marine engineering a natural part of PSP's work.",
      "The team regularly supports marine-focused builds and modifications for yachting, racing boats, surf lifesaving boats, and fishing rigs.",
      "Marine projects often demand robust materials, precision fitting, and parts designed to handle harsh conditions. PSP can tailor components to suit those exact needs.",
    ],
    highlight: "Built for demanding marine environments and specialist boat applications.",
  },
];

const products = [
  {
    slug: "surfkit",
    name: "PSP SurfKit",
    strap: "Engine Upgrade Kits for Surf Rescue",
    short: "A collection of upgraded engine components designed for strength and reliability under surf lifesaving conditions.",
    image: "/public/img/surf_boat.jpg",
    body: [
      "PSP's SurfKit is a collection of powerfully upgraded engine components designed for strength and reliability under surf lifesaving conditions.",
      "These kits are trusted by surf lifesaving clubs and competitive sport users who need dependable performance in demanding environments.",
      "SurfKit products and components are unique PSP items. Contact the team for pricing, availability, and advice on the best place to purchase and install the right setup.",
    ],
  },
  {
    slug: "vision-trap",
    name: "Vision Trap",
    strap: "Trap Maintenance Made Easy",
    short: "A safer, easier, more accessible alternative to a traditional p-trap for air-conditioning drainage lines.",
    image: "/public/img/vision_trap.jpg",
    body: [
      "Vision Trap is designed specifically for air-conditioning maintenance and acts as a direct replacement for the traditional p-trap.",
      "Its transparent bowl enables one-glance monitoring, quick access for cleaning, and easier maintenance in tight spaces.",
      "With a compact profile and 225ml capacity, it offers more accessible servicing while helping prevent build-up and overflow issues.",
    ],
  },
];

const surfkitItems = [
  { name: "Safety Strop (General)", image: "/public/img/safety-strop-general.jpg" },
  { name: "Dia 10 Outboard Support Rod", image: "/public/img/dia-10-outboard-support-rod.jpg" },
  { name: "UHMWPE Solid Engine Mounts (set of 4)", image: "/public/img/uhmwpe-solid-engine-mounts.jpg" },
  { name: "Bungy Cowling Clamp System", image: "/public/img/bungy-cowling-clamp-system.jpg" },
  { name: "Pull Start Extension", image: "/public/img/pull-start-extension.jpg" },
  { name: "IRB Rack (3 tier 316 S/S)", image: "/public/img/irb-rack-3-tier.jpg" },
  { name: "S/S Compression Tube", image: "/public/img/s-s-compression-tube.jpg" },
  { name: "Weighted Racing Spinners (set of 2)", image: "/public/img/weighted-racing-spinners.jpg" },
  { name: "Standard Spinners (set of 2)", image: "/public/img/standard-spinners.jpg" },
];

const reviews = [
  {
    rating: 4,
    person: "Bruce Idoine",
    role: "Director, APD Limited",
    quote: "We have used PSP Engineering for the past ten years for machining a wide range of plastics. Whether it's for hundreds of components or one-off work, it's never too much trouble and quality and service are consistently good.",
  },
  {
    rating: 5,
    person: "Clint Wishard",
    role: "",
    quote: "I would like to commend you on your efficient service. When orders are placed, we can always count on quality parts that are expedited on time. It is a pleasure to do business with a loyal company who shows genuine concern for their customers and the products they produce.",
  },
  {
    rating: 4,
    person: "Grant Williams",
    role: "Kinetic Wind Sculpture",
    quote: "I am not a big client financially for PSP but they have always succeeded in working within my budget. Together we have come up with simple solutions for complex problems that have worked extremely well.",
  },
];

const stockists = [
  {
    name: "Patton",
    description: "Patton supplies quality brands backed by highly trained, experienced staff who can provide design and technical support across refrigeration, air conditioning, and mechanical service needs.",
    locations: ["9 branches in New Zealand", "11 branches in Australia", "Noida, India", "Samutprakam, Thailand"],
    website: "https://www.pattonnz.com",
  },
  {
    name: "Realcold",
    description: "Realcold is a wholesale supplier to the refrigeration and air-conditioning industry in New Zealand, managed and operated by qualified, experienced refrigeration engineers.",
    locations: ["Whangarei", "North Harbour", "Auckland", "Hamilton", "Tauranga", "Hawkes Bay", "Palmerston North", "Wellington", "Christchurch", "Dunedin"],
    website: "https://www.realcold.co.nz",
  },
];

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const formStatusContent = {
  success: {
    tone: "success",
    title: "Message sent",
    copy: "Thanks for reaching out. Your enquiry has been sent to PSP Engineering.",
  },
  missing: {
    tone: "error",
    title: "Please complete the required fields",
    copy: "Name, email, and message are required before the form can be sent.",
  },
  invalid_email: {
    tone: "error",
    title: "Please enter a valid email",
    copy: "The email address provided does not look valid. Please check it and try again.",
  },
  captcha_required: {
    tone: "error",
    title: "Please complete the security check",
    copy: "Please confirm you are not a robot before sending your enquiry.",
  },
  captcha_failed: {
    tone: "error",
    title: "Security check failed",
    copy: "We could not verify the security check. Please try again.",
  },
  unavailable: {
    tone: "error",
    title: "Email sending is not configured yet",
    copy: "The form is ready, but the SMTP2GO API settings still need to be added on the server before emails can be delivered.",
  },
  failed: {
    tone: "error",
    title: "Message could not be sent",
    copy: "Something went wrong while sending the email. Please try again or contact PSP by phone.",
  },
};

module.exports = {
  company,
  services,
  products,
  surfkitItems,
  reviews,
  stockists,
  nav,
  formStatusContent,
};
