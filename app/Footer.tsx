const navigation = {
  main: [
    {
      name: "GitHub",
      href: "https://github.com/Udruga-P-O-I-N-T/krizevci-events",
    },
    {
      name: "API GitHub",
      href: "https://github.com/Udruga-P-O-I-N-T/krizevci-api",
    },
    {
      name: "API GraphQL",
      href: "https://krizevci-api.fly.dev//graphql",
    },
  ],
};

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto pt-24 pb-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav
        className="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        {navigation.main.map((item) => (
          <div key={item.name} className="px-5 py-2">
            <a
              href={item.href}
              className="text-base text-gray-500 hover:text-gray-200"
            >
              {item.name}
            </a>
          </div>
        ))}
      </nav>
    </footer>
  );
}
