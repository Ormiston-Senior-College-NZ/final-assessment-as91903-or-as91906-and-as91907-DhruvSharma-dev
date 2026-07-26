import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";
import Layout from "../components/Layout";
import { getStoredWebAppLinks, loadStoredWebAppLinks } from "../data/studentNetData";

function getLogoUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
  }
}

function WebAppCard({ label, url, highlight }) {
  const logoUrl = getLogoUrl(url);

  return (
    <article className="flex min-h-56 flex-col justify-between rounded-lg border border-[#F2901D] bg-white p-4 shadow-sm">
      <div className="flex flex-1 items-center justify-center">
        <img
          src={logoUrl}
          alt={`${label} logo`}
          className="h-24 w-24 object-contain"
        />
      </div>

      <div className="flex items-end justify-between gap-4">
        <h2 className="text-sm font-medium text-gray-950">
          <HighlightText text={label} highlight={highlight} />
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
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";
  const [webApps, setWebApps] = useState(() => getStoredWebAppLinks());

  useEffect(() => {
    loadStoredWebAppLinks().then(setWebApps);
  }, []);

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
              key={app.id}
              highlight={highlight}
              {...app}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
