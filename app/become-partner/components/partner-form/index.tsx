"use client";

import { useState } from "react";
import { CONTACT } from "@/app/config/constants";

export default function PartnerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/info@apnizaroorat.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: "Partner Registration Request",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dark:bg-darkmode lg:pb-24 pb-16 px-4">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-darklight border border-border dark:border-dark_border rounded-xl shadow-lg p-6 sm:p-8 md:p-10" data-aos="fade-up">
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
                Thank you! We&apos;ll contact you soon to discuss partnership opportunities.
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="pb-2 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Full Name*
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full text-base px-4 rounded-lg py-2.5 border border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode text-midnight_text dark:text-white transition-all duration-500 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-darklight focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="pb-2 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Email Address*
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full text-base px-4 py-2.5 rounded-lg border border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode text-midnight_text dark:text-white transition-all duration-500 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-darklight focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="phone" className="pb-2 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Phone Number*
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full text-base px-4 py-2.5 rounded-lg border border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode text-midnight_text dark:text-white transition-all duration-500 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-darklight focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="company" className="pb-2 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Company Name*
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full text-base px-4 py-2.5 rounded-lg border border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode text-midnight_text dark:text-white transition-all duration-500 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-darklight focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="message" className="pb-2 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Tell us about your business*
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full text-base px-4 py-2.5 rounded-lg border border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode text-midnight_text dark:text-white transition-all duration-500 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-darklight focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary rounded-lg text-white py-4 px-8 mt-2 inline-block hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? "Submitting..." : "Submit Partnership Request"}
                </button>
              </div>
            </form>
            <div className="mt-6 pt-6 border-t border-border dark:border-dark_border">
              <p className="text-sm text-gray dark:text-gray-400 text-center">
                Have questions? Contact us at{" "}
                <a href={`mailto:${CONTACT.EMAIL}`} className="text-primary hover:underline">
                  {CONTACT.EMAIL}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
