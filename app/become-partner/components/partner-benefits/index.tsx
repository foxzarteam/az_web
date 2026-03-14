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
    <section className="bg-light dark:bg-darkmode py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-midnight_text dark:text-white text-center mb-8 sm:mb-12" data-aos="fade-up">
          Why Partner With Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-darklight border border-border dark:border-dark_border rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-0"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl md:text-4xl">{benefit.emoji}</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-midnight_text dark:text-white mb-1.5 sm:mb-2 leading-tight">
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
