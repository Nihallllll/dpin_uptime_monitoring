"use client";
import React, { useEffect } from "react";
import { Activity, Bell, Clock, Server, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// 1. --- Props Types ---

type FeatureCardProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
};

type PricingCardProps = {
  title: string;
  price: string | number;
  features: string[];
  featured?: boolean;
};

// 2. --- FeatureCard (typed) ---

function FeatureCard({
  icon = <Activity className="h-6 w-6 text-indigo-400" />,
  title = "Feature",
  description = "...",
}: FeatureCardProps) {
  return (
    <div className="p-7 bg-gradient-to-b from-[#1a2131] via-[#222844] to-[#181d2d] border border-indigo-900/40 rounded-2xl shadow-lg hover:shadow-xl transition group relative overflow-hidden">
      <div className="absolute top-0 left-0 h-2 w-24 bg-indigo-600 group-hover:w-full transition-all duration-400 rounded-b-full opacity-5" />
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-semibold text-indigo-100 mb-2">{title}</h3>
      <p className="text-indigo-400">{description}</p>
    </div>
  );
}

// 3. --- PricingCard (typed) ---

function PricingCard({
  title,
  price,
  features = [],
  featured = false,
}: PricingCardProps) {
  return (
    <div
      className={`
        p-8 rounded-2xl border-2 shadow-xl bg-gradient-to-br
        ${
          featured
            ? "from-indigo-700 via-indigo-800 to-indigo-900 border-indigo-500 ring-[3px] ring-indigo-400/40 scale-105 z-20"
            : "from-[#151324] via-[#1c2040] to-[#181c2f] border-indigo-900/40 opacity-85"
        }
        text-white relative flex flex-col items-start
        hover:scale-105 transition-transform
      `}
    >
      {featured && (
        <span className="absolute top-5 right-5 bg-indigo-400/90 px-3 py-1 text-xs font-semibold rounded-full uppercase shadow">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <div className="mb-4 flex items-end">
        <span className="text-4xl font-extrabold">${price}</span>
        <span className="text-base text-indigo-300 ml-1 mb-1 font-normal">/month</span>
      </div>
      <ul className="space-y-3 mb-7 text-indigo-100">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-[18px] w-[18px] text-indigo-300" /> <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`
          w-full mt-auto py-3 rounded-xl font-semibold text-lg shadow
          ${
            featured
              ? "bg-white/90 text-indigo-800 hover:bg-white transition"
              : "bg-indigo-600 hover:bg-indigo-500 transition"
          }
        `}
      >
        Get Started
      </button>
    </div>
  );
}

// 4. --- App Component (Unchanged but uses the above) ---

function App() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#141824] via-[#202840] to-[#232840] text-white font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Monitor Your Services<br />with Confidence
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-indigo-100 max-w-md">
              Get instant alerts when your services go down. Monitor uptime, performance, and ensure your business never misses a beat.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3 bg-indigo-600 shadow-lg hover:scale-[1.03] hover:bg-indigo-500 hover:shadow-xl active:scale-100 transform transition rounded-xl font-semibold text-lg flex items-center justify-center gap-2 ring-2 ring-indigo-400/20 focus:outline-none focus:ring-4"
              >
                Start Monitoring <ArrowRight className="ml-1 h-5 w-5" />
              </button>
              <button
                className="px-8 py-3 bg-white hover:bg-gray-200/90 text-indigo-700 dark:bg-indigo-900 dark:text-white dark:ring-1 dark:ring-indigo-600/20 dark:hover:bg-indigo-800 transition rounded-xl font-semibold text-lg shadow"
              >
                View Demo
              </button>
            </div>
          </div>
          <div className="hidden md:block relative group">
            <div className="absolute inset-0 blur-3xl opacity-60 pointer-events-none rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-purple-400/20 to-transparent z-0" />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              alt="Dashboard preview"
              className="relative z-10 rounded-3xl shadow-2xl border-4 border-indigo-800/40"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 bg-indigo-900/80 py-20 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-indigo-200 [text-shadow:_0_1px_4px_rgba(70,35,180,0.18)]">
            Everything you need for reliable monitoring
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Bell className="h-9 w-9 text-indigo-400" />}
              title="Instant Alerts"
              description="Get notified immediately when your services experience downtime through multiple channels."
            />
            <FeatureCard
              icon={<Clock className="h-9 w-9 text-indigo-400" />}
              title="24/7 Monitoring"
              description="Round-the-clock monitoring from multiple locations worldwide."
            />
            <FeatureCard
              icon={<Server className="h-9 w-9 text-indigo-400" />}
              title="Detailed Reports"
              description="Comprehensive analytics to track your service performance."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-indigo-950 via-[#16192f] to-indigo-900/80">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-indigo-200">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="29"
              features={[
                "10 monitors",
                "1-min checks",
                "Email notifications",
                "5 team members",
                "24h data retention",
              ]}
            />
            <PricingCard
              title="Professional"
              price="79"
              featured={true}
              features={[
                "50 monitors",
                "30s checks",
                "All notifications",
                "Unlimited team",
                "30-day data retention",
                "API access",
              ]}
            />
            <PricingCard
              title="Enterprise"
              price="199"
              features={[
                "Unlimited monitors",
                "15s checks",
                "Priority support",
                "Custom solutions",
                "90-day retention",
                "SLA guarantee",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#11121a] border-t border-indigo-900/40 text-indigo-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 text-sm">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-indigo-400" />
                <span className="text-lg font-bold tracking-widest">UptimeGuard</span>
              </div>
              <p className="mt-4 text-indigo-400/70 max-w-sm">Keeping your services online, always.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 tracking-wider uppercase">Product</h3>
              <ul className="space-y-2 text-indigo-400/80">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 tracking-wider uppercase">Company</h3>
              <ul className="space-y-2 text-indigo-400/80">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 tracking-wider uppercase">Legal</h3>
              <ul className="space-y-2 text-indigo-400/80">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-indigo-800 text-center text-indigo-400/50 text-sm tracking-wider">
            <p>&copy; 2025 UptimeGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
