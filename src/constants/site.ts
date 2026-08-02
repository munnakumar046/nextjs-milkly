export const siteConfig = {
  name: "B2 MILK",
  description: "Fresh Milk Delivery Platform",
  url: "http://localhost:3000",

  links: {
    github: "https://github.com/munnakumar046/nextjs-milkly",
  },

  navigation: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Products",
      href: "/products",
    },
    {
      title: "Subscription",
      href: "/subscriptions",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
} as const;
