"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

// ✅ Define animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function AboutPageClient() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          About FreelanceMY
        </h2>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
          FreelanceMY is built to empower freelancers in Malaysia with the tools,
          insights, and opportunities they need to thrive in today’s digital economy.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInLeft}
        className="grid md:grid-cols-2 gap-10 items-center"
      >
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-md">
          <Image
            src="https://loigoouddqshbpygboos.supabase.co/storage/v1/object/public/blog-images/freelancemy-mission.jpg"
            alt="FreelanceMY Mission"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We’re on a mission to bridge the gap between talent and opportunity —
            making freelancing a sustainable career choice in Malaysia and across APAC.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
          Our Values
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Transparency",
              text: "We believe in open communication, clear pricing, and building trust with every interaction.",
            },
            {
              title: "Empowerment",
              text: "Our platform is designed to give freelancers the tools they need to succeed independently.",
            },
            {
              title: "Community",
              text: "Freelancing is stronger when we work together — we’re building a supportive ecosystem.",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInRight}
        className="text-center max-w-2xl mx-auto"
      >
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Looking Ahead
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          FreelanceMY is more than a platform — it’s a movement to redefine
          independent work in Malaysia. Together, we’re shaping the future of
          freelancing.
        </p>
      </motion.section>
    </main>
  );
}
