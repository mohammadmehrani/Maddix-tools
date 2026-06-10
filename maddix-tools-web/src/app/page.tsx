"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  locales,
  sections,
  xssPayloads,
  sqlPayloads,
  lfiPayloads,
  linuxCommands,
  reverseShellTemplates,
  cveExamples,
  networkGuides,
  handyNotes,
} from "@/data/site";

type SectionId = (typeof sections)[number]["id"];
type Theme = "light" | "dark";

type ParseResult = {
  ips: string[];
  domains: string[];
};

const algorithms = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const;

function joinUnique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).sort();
}

function extractIpsAndDomains(value: string): ParseResult {
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|1?\d{1,2})\b/g;
  const domainRegex = /\b((?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63})\b/g;

  const rawIps = value.match(ipRegex) ?? [];
  const rawDomains = (value.match(domainRegex) ?? []).filter((domain) => !ipRegex.test(domain));

  return {
    ips: joinUnique(rawIps),
    domains: joinUnique(rawDomains),
  };
}

function configType(value: string) {
  if (value.startsWith("vmess://")) return "vmess";
  if (value.startsWith("vless://")) return "vless";
  if (value.startsWith("wireguard://")) return "wireguard";
  if (value.startsWith("trojan://")) return "trojan";
  return "unknown";
}

function replaceConfigWithIp(value: string, ip: string, portOverride?: string) {
  const type = configType(value);

  if (type === "vmess") {
    try {
      const payload = value.slice(8);
      const decoded = JSON.parse(atob(payload));
      decoded.add = ip;
      if (portOverride) decoded.port = Number(portOverride);
      return `vmess://${btoa(JSON.stringify(decoded))}`;
    } catch {
      return value;
    }
  }

  if (type === "vless") {
    return value.replace(/^(vless:\/\/[^@]+@)([^:]+)(:\d+)(.*)$/i, (_match, prefix, _host, port, suffix) => {
      return portOverride ? `${prefix}${ip}:${portOverride}${suffix}` : `${prefix}${ip}${port}${suffix}`;
    });
  }

  if (type === "wireguard") {
    return value.replace(/^(wireguard:\/\/[^@]+@)([^:]+)(:\d+)(.*)$/i, (_match, prefix, _host, port, suffix) => {
      return portOverride ? `${prefix}${ip}:${portOverride}${suffix}` : `${prefix}${ip}${port}${suffix}`;
    });
  }

  if (type === "trojan") {
    return value.replace(/^(trojan:\/\/[^@]+@)([^:]+)(:\d+)(.*)$/i, (_match, prefix, _host, port, suffix) => {
      return portOverride ? `${prefix}${ip}:${portOverride}${suffix}` : `${prefix}${ip}${port}${suffix}`;
    });
  }

  return value;
}

async function hashText(text: string, algorithm: typeof algorithms[number]) {
  if (!text) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const algo = algorithm === "MD5" ? "SHA-256" : algorithm;
  const digest = await window.crypto.subtle.digest(algo, data);

  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function Home() {
  const [section, setSection] = useState<SectionId>("overview");
  const [language, setLanguage] = useState<typeof DEFAULT_LANGUAGE>(DEFAULT_LANGUAGE);
  const [theme, setTheme] = useState<Theme>("light");
  const [scannerInput, setScannerInput] = useState("");
  const [scannerResult, setScannerResult] = useState<ParseResult>({ ips: [], domains: [] });
  const [configInput, setConfigInput] = useState("");
  const [configIPs, setConfigIPs] = useState("");
  const [configPort, setConfigPort] = useState("");
  const [generatedConfig, setGeneratedConfig] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [hashAlgo, setHashAlgo] = useState<typeof algorithms[number]>("SHA-256");
  const [hashOutput, setHashOutput] = useState("");
  const [cveQuery, setCveQuery] = useState("");
  const locale = locales[language];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const filteredCves = useMemo(() => {
    if (!cveQuery.trim()) return cveExamples;
    const query = cveQuery.toLowerCase();
    return cveExamples.filter((item) => item.id.toLowerCase().includes(query) || item.title.toLowerCase().includes(query) || item.tags.some((tag) => tag.toLowerCase().includes(query)));
  }, [cveQuery]);

  const handleScan = () => {
    setScannerResult(extractIpsAndDomains(scannerInput));
  };

  const handleGenerate = () => {
    const ipLines = configIPs.split(/[\r\n]+/).map((line) => line.trim()).filter(Boolean);
    if (!configInput.trim() || ipLines.length === 0) {
      setGeneratedConfig("لطفاً یک کانفیگ پایه و حداقل یک IP جایگزین وارد کنید.");
      return;
    }

    const results = ipLines.map((ip) => replaceConfigWithIp(configInput.trim(), ip, configPort.trim()));
    setGeneratedConfig(results.join("\n\n"));
  };

  const handleHash = async () => {
    if (!hashInput) {
      setHashOutput("");
      return;
    }
    const result = await hashText(hashInput, hashAlgo);
    setHashOutput(result);
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      alert(locale.hacktools.copied);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600">MaddixTools</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{locale.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{locale.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800"
              >
                {theme === "dark" ? "🌙" : "☀️"} {locale.theme}
              </button>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as typeof language)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="en">English</option>
                <option value="fa">فارسی</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">{sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${section === item.id ? "bg-slate-900 text-white shadow-lg" : "bg-white/80 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"}`}
            >
              {item.label[language]}
            </button>
          ))}</div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">{locale.summary}</h2>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.about.existing}</p>
            </div>
            <div className="space-y-3 pt-4">
              {handyNotes.map((note) => (
                <div key={note.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{note.label}</p>
                  <a href={note.value} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-medium text-slate-900 underline decoration-sky-500 decoration-2 underline-offset-4 dark:text-slate-100">
                    {note.value}
                  </a>
                </div>
              ))}
            </div>
          </aside>

          <section className="space-y-8">
            {section === "overview" && (
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{locale.liveSite}</h3>
                    <p className="mt-3 text-lg text-slate-900 dark:text-slate-100">https://maddixtools.vercel.app</p>
                  </article>
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">HackTools</h3>
                    <p className="mt-3 text-lg text-slate-900 dark:text-slate-100">Payloads, cheatsheets, hash tools</p>
                  </article>
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Network</h3>
                    <p className="mt-3 text-lg text-slate-900 dark:text-slate-100">DNS, Edge IP, SNI, V2Ray</p>
                  </article>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-base font-semibold">{locale.scanner.button}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.scanner.note}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-base font-semibold">{locale.v2ray.button}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.v2ray.label}</p>
                  </div>
                </div>
              </div>
            )}

            {section === "scanner" && (
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div>
                  <h2 className="text-2xl font-semibold">{sections.find((item) => item.id === "scanner")?.label[language]}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.scanner.label}</p>
                </div>
                <textarea
                  value={scannerInput}
                  onChange={(event) => setScannerInput(event.target.value)}
                  placeholder="145.239.5.83\nexample.com\nhttps://maddixtools.vercel.app"
                  className="min-h-[160px] w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={handleScan} className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                    {locale.scanner.button}
                  </button>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{locale.scanner.note}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{locale.scanner.ips}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{scannerResult.ips.length}</p>
                    <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {scannerResult.ips.length ? scannerResult.ips.map((ip) => (
                        <div key={ip} className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/90">{ip}</div>
                      )) : <div className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/90 text-slate-500">—</div>}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{locale.scanner.domains}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{scannerResult.domains.length}</p>
                    <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {scannerResult.domains.length ? scannerResult.domains.map((domain) => (
                        <div key={domain} className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/90">{domain}</div>
                      )) : <div className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/90 text-slate-500">—</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section === "v2ray" && (
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div>
                  <h2 className="text-2xl font-semibold">{sections.find((item) => item.id === "v2ray")?.label[language]}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.v2ray.label}</p>
                </div>
                <textarea
                  value={configInput}
                  onChange={(event) => setConfigInput(event.target.value)}
                  placeholder={locale.v2ray.placeholderConfig}
                  className="min-h-[140px] w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                />
                <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                  <textarea
                    value={configIPs}
                    onChange={(event) => setConfigIPs(event.target.value)}
                    placeholder={locale.v2ray.ipListPlaceholder}
                    className="min-h-[140px] w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                  />
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{locale.v2ray.portLabel}</label>
                    <input
                      value={configPort}
                      onChange={(event) => setConfigPort(event.target.value)}
                      type="text"
                      placeholder="443"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
                    />
                    <button type="button" onClick={handleGenerate} className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                      {locale.v2ray.button}
                    </button>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{locale.v2ray.generated}</p>
                  <pre className="mt-4 whitespace-pre-wrap break-words text-sm text-slate-900 dark:text-slate-100">{generatedConfig || "..."}</pre>
                </div>
              </div>
            )}

            {section === "hacktools" && (
              <div className="space-y-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div>
                  <h2 className="text-2xl font-semibold">{sections.find((item) => item.id === "hacktools")?.label[language]}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.hacktools.payloads}</p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-lg font-semibold">{locale.hacktools.xss}</h3>
                    <div className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {xssPayloads.map((payload) => (
                        <div key={payload} className="flex items-start justify-between rounded-2xl bg-white/80 p-3 dark:bg-slate-900/90">
                          <span>{payload}</span>
                          <button onClick={() => copyToClipboard(payload)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700">
                            {locale.hacktools.copy}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-lg font-semibold">{locale.hacktools.sqli}</h3>
                    <div className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {sqlPayloads.map((payload) => (
                        <div key={payload} className="flex items-start justify-between rounded-2xl bg-white/80 p-3 dark:bg-slate-900/90">
                          <span>{payload}</span>
                          <button onClick={() => copyToClipboard(payload)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700">
                            {locale.hacktools.copy}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-lg font-semibold">{locale.hacktools.lfi}</h3>
                    <div className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {lfiPayloads.map((payload) => (
                        <div key={payload} className="flex items-start justify-between rounded-2xl bg-white/80 p-3 dark:bg-slate-900/90">
                          <span>{payload}</span>
                          <button onClick={() => copyToClipboard(payload)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700">
                            {locale.hacktools.copy}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-lg font-semibold">{locale.hacktools.linux}</h3>
                    <div className="space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {linuxCommands.map((entry) => (
                        <div key={entry.title} className="rounded-2xl bg-white/80 p-3 dark:bg-slate-900/90">
                          <p className="font-medium">{entry.title}</p>
                          <p>{entry.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                    <div>
                      <h3 className="text-lg font-semibold">{locale.hacktools.reverseShell}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{locale.hacktools.cvePlaceholder}</p>
                    </div>
                    <div className="grid gap-3">
                      <input value={hashInput} onChange={(event) => setHashInput(event.target.value)} placeholder="127.0.0.1" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" />
                      <input value={configPort} onChange={(event) => setConfigPort(event.target.value)} placeholder="4444" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {reverseShellTemplates.map((template) => {
                      const payload = template.template.replace(/{IP}/g, hashInput || "127.0.0.1").replace(/{PORT}/g, configPort || "4444");
                      return (
                        <div key={template.name} className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 dark:bg-slate-900/90">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{template.name}</p>
                            <button onClick={() => copyToClipboard(payload)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700">
                              {locale.hacktools.copy}
                            </button>
                          </div>
                          <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-300">{payload}</pre>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{locale.hacktools.hash}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{locale.hacktools.hashPlaceholder}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select value={hashAlgo} onChange={(event) => setHashAlgo(event.target.value as typeof hashAlgo)} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                        {algorithms.map((algorithm) => (
                          <option key={algorithm} value={algorithm}>{algorithm}</option>
                        ))}
                      </select>
                      <button onClick={handleHash} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">{locale.hacktools.hash}</button>
                    </div>
                  </div>
                  <input value={hashInput} onChange={(event) => setHashInput(event.target.value)} placeholder={locale.hacktools.hashPlaceholder} className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" />
                  <div className="mt-4 rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
                    <p className="font-medium">{locale.hacktools.hashOutput}</p>
                    <pre className="mt-2 break-words">{hashOutput || "--"}</pre>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-lg font-semibold">{locale.hacktools.cve}</h3>
                  <input value={cveQuery} onChange={(event) => setCveQuery(event.target.value)} placeholder={locale.hacktools.cvePlaceholder} className="mt-4 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  <div className="mt-4 space-y-3">
                    {filteredCves.length ? filteredCves.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-white/80 p-4 dark:bg-slate-900/90">
                        <p className="font-semibold">{item.id}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.title}</p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{item.tags.join(", ")}</p>
                      </div>
                    )) : <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-600 dark:bg-slate-900/90 dark:text-slate-400">{locale.hacktools.noResults}</div>}
                  </div>
                </div>
              </div>
            )}

            {section === "network" && (
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div>
                  <h2 className="text-2xl font-semibold">{sections.find((item) => item.id === "network")?.label[language]}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.network.summary}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {networkGuides.map((guide) => (
                    <div key={guide.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                      <h3 className="font-semibold">{guide.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{guide.description}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-lg font-semibold">{locale.network.docs}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{locale.network.note}</p>
                </div>
              </div>
            )}

            {section === "about" && (
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div>
                  <h2 className="text-2xl font-semibold">{sections.find((item) => item.id === "about")?.label[language]}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.about.thanks}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <a href="https://maddixtools.vercel.app" target="_blank" rel="noreferrer" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{locale.about.deploy}</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">https://maddixtools.vercel.app</p>
                  </a>
                  <a href="https://github.com/mohammadmehrani/Maddix-tools" target="_blank" rel="noreferrer" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{locale.about.repo}</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">GitHub Repository</p>
                  </a>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{locale.about.existing}</p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

