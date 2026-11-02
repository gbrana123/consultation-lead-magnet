export const siteConfig = {
  brand: {
    name: "GrowNep",
    logo: "/logo.png",
    icon: "/logo-icon.png",
    logoAlt: "GrowNep",
  },
  seo: {
    title: "Free AI Marketing Consultation | Get a Customized Marketing Plan",
    description:
      "Book a free 30-minute digital marketing consultation and receive a customized digital marketing plan in PDF format.",
  },
  hero: {
    beforeHighlight: "Struggling to get",
    highlight: "Customers Online?",
    afterHighlight: "",
    subheadline:
      "Get a Free 30 Day Digital Marketing Plan for Your Business",
    description:
      "This is a free 30-minute AI marketing consultation for business owners who want more customers. You get a plan made for your business, not a generic template.",
    cta: "Book Free Consultation",
  },
  problem: {
    title: "Sound familiar?",
    items: [
      "You post. You boost. But orders are slow.",
      "People like your posts but do not order.",
      "You boost a post and do not know if it brought a single customer.",
      'People ask "price?" and then disappear.',
    ],
  },
  benefits: {
    title: "What you get from this consultation",
    items: [
      "Find out why people like your posts but do not order",
      "Know what to fix first on your page and ads",
      "Get a customized plan in PDF format you can start using this week",
      "Learn where AI can save you time on content",
      "Know exactly what your next step is",
    ],
  },
  process: {
    title: "How it works",
    steps: [
      {
        title: "Book your call.",
        description: "Fill out the short form below.",
      },
      {
        title: "I review your business.",
        description: "I look at your page before we talk.",
      },
      {
        title: "Get your plan.",
        description:
          "We talk for 30 minutes. You receive a customized digital marketing plan in PDF format.",
      },
    ],
  },
  form: {
    title: "Book Your Free Consultation",
    chips: [
      "Book the Call",
      "One-to-One Consultation",
      "Customized Strategy for Your Business",
    ],
    submit: "Book Free Consultation",
    submitting: "Booking Your Consultation...",
    trust: "We respect your privacy. No spam.",
    fields: {
      fullName: {
        label: "Full Name",
        placeholder: "Your full name",
      },
      email: {
        label: "Active Email",
        placeholder: "you@example.com",
      },
      whatsapp: {
        label: "WhatsApp Number",
        placeholder: "+977 98XXXXXXXX",
      },
      businessName: {
        label: "Business Name",
        placeholder: "Your business name",
      },
      website: {
        label: "Website or Facebook URL",
        placeholder: "facebook.com/yourbusiness",
      },
      message: {
        label: "Anything You Want to Say",
        placeholder: "Tell us anything that will help us understand your business.",
      },
    },
    generalError:
      "We couldn't submit your request. Please check your connection and try again.",
  },
  thankYou: {
    title: "Thank You.",
    message: "Your request for Free AI Marketing Consultation has been submitted.",
    steps: [
      "Watch the short video below.",
      "Message us on WhatsApp so we can confirm your call.",
    ],
    whatsappLabel: "Connect with Me on WhatsApp",
    videoTitle: "GrowNep welcome message",
    welcomeVideoMp4: "/welcome-message.mp4",
    whatsappMessage:
      "Hi, I just submitted the form for the Free Digital Marketing Consultation. I'd like to know the next steps.",
  },
} as const;

export const publicConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  vimeoUrl: process.env.NEXT_PUBLIC_VIMEO_URL ?? "",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "9779864683116",
  formEndpoint:
    process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "/submit-consultation.php",
} as const;
