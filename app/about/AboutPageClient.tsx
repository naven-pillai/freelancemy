"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const values = [
  {
    icon: "🔍",
    title: "Transparency",
    text: "We believe in open communication, clear pricing, and building trust with every interaction.",
  },
  {
    icon: "⚡",
    title: "Empowerment",
    text: "Our platform is built to give freelancers the tools, insights, and confidence to grow independently.",
  },
  {
    icon: "🤝",
    title: "Community",
    text: "Freelancing works better when people support each other. We are building that ecosystem here.",
  },
];

export default function AboutPageClient() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50 px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />

        <motion.div
          className="relative mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeInUp}
            className="mb-6 inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 backdrop-blur"
          >
            About FreelanceMY
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mx-auto max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl"
          >
            Built for Malaysian freelancers who want to work smarter, earn better,
            and grow with confidence.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl"
          >
            FreelanceMY exists to help freelancers in Malaysia navigate the real
            side of independent work — from tools and systems to insights,
            opportunities, and practical guidance that actually matters.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
  href="/"
  className="rounded-2xl bg-(--accent) px-7 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-(--accent-hover)"
>
  Explore Guides
</Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-50 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="grid items-center gap-12 md:grid-cols-2 md:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeInLeft} className="relative">
              <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/60 md:h-120">
                <Image
                  src="https://loigoouddqshbpygboos.supabase.co/storage/v1/object/public/blog-images/freelancemy-mission.jpg"
                  alt="FreelanceMY mission"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur md:left-auto md:right-6 md:w-72">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Since 2024
                </p>
                <p className="mb-0 text-sm leading-6 text-slate-600">
                  Building a more practical, trusted resource hub for the freelance community.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <span className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Our Mission
              </span>

              <h2 className="mt-0 text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Bridging talent, clarity, and opportunity for freelancers in Malaysia.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Freelancing should not feel confusing, unstable, or isolated.
                Our mission is to make independent work more sustainable and more
                respected by giving freelancers access to useful knowledge,
                better tools, and a stronger sense of direction.
              </p>

              <blockquote className="mt-8 rounded-2xl border-l-0 border border-slate-200 bg-slate-50 px-6 py-5 text-base italic text-slate-600">
                “Every freelancer deserves access to clear guidance that helps
                them win better work and build a stronger business.”
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mx-auto mb-14 max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={fadeInUp}
          >
            <span className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
              What We Stand For
            </span>

            <h2 className="mt-0 text-3xl font-semibold text-slate-950 md:text-5xl">
              Built on principles that actually matter
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We are not here to publish fluff. We are here to create a more
              useful, trustworthy, and practical platform for freelancers.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {value.icon}
                </div>

                <h3 className="mt-0 text-xl font-semibold text-slate-950">
                  {value.title}
                </h3>

                <p className="mt-3 mb-0 text-base leading-7 text-slate-600">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-24">
        <motion.div
          className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50 px-8 py-14 text-center shadow-xl shadow-slate-200/50 md:px-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.span
            variants={fadeInUp}
            className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm"
          >
            Looking Ahead
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="mt-0 text-3xl font-semibold leading-tight text-slate-950 md:text-5xl"
          >
            More than a content platform.
            <br className="hidden md:block" />
            A stronger future for freelancers.
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
          >
            FreelanceMY is here to help freelancers make better decisions, find
            better tools, and grow with more confidence in a changing digital economy.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/"
              className="rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold !text-slate-50 shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Read Our Guides
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}