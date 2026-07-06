import Layout from "../components/Layout";

const webApps = [
  {
    name: "Best Choice for Chemistry",
    url: "https://www.bestchoice.net.nz/",
    logoUrl: "https://www.google.com/s2/favicons?domain=bestchoice.net.nz&sz=128",
  },
  {
    name: "Google Classroom",
    url: "https://classroom.google.com/",
    logoUrl: "https://www.google.com/s2/favicons?domain=classroom.google.com&sz=128",
  },
  {
    name: "Gmail",
    url: "https://mail.google.com/",
    logoUrl: "https://www.google.com/s2/favicons?domain=mail.google.com&sz=128",
  },
  {
    name: "MyPortfolio",
    url: "https://myportfolio.school.nz/",
    logoUrl: "https://www.google.com/s2/favicons?domain=myportfolio.school.nz&sz=128",
  },
  {
    name: "RefSeek",
    url: "https://www.refseek.com/",
    logoUrl: "https://www.google.com/s2/favicons?domain=refseek.com&sz=128",
  },
];

function WebAppCard({ name, url, logoUrl }) {
  return (
    <article className="flex min-h-56 flex-col justify-between rounded-lg border border-[#F2901D] bg-white p-4 shadow-sm">
      <div className="flex flex-1 items-center justify-center">
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-24 w-24 object-contain"
        />
      </div>

      <div className="flex items-end justify-between gap-4">
        <h2 className="text-sm font-medium text-gray-950">
          {name}
        </h2>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-[#F2901D] px-8 py-2 text-xs font-semibold uppercase text-white transition hover:bg-[#d87d11] focus:outline-none focus:ring-2 focus:ring-[#F2901D] focus:ring-offset-2"
        >
          Open
        </a>
      </div>
    </article>
  );
}

export default function WebApps() {
  return (
    <Layout>
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Web-Based App(s)
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-200">
            Useful learning tools and school websites collected in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {webApps.map((app) => (
            <WebAppCard
              key={app.name}
              {...app}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
