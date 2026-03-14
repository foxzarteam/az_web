export default function PartnerBenefits() {
  const benefits = [
    {
      emoji: "💰",
      title: "Earn Up to ₹1 Lakh+ Monthly",
      description: "Help people get financial products and earn high commissions.",
    },
    {
      emoji: "🌍",
      title: "Work From Anywhere",
      description: "Run your business anytime using just your mobile.",
    },
    {
      emoji: "🚀",
      title: "Zero Investment Start",
      description: "No joining fee, no investment — start earning instantly.",
    },
    {
      emoji: "⚡",
      title: "Fast & Secure Payouts",
      description: "Receive your earnings quickly after successful approvals.",
    },
  ];

  return (
    <section className="bg-light dark:bg-darkmode py-16 px-4">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight_text dark:text-white text-center mb-12" data-aos="fade-up">
          Why Partner With Us?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-darklight border border-border dark:border-dark_border rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl">{benefit.emoji}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-midnight_text dark:text-white mb-2 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-gray dark:text-gray-400 text-xs sm:text-sm leading-snug">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
