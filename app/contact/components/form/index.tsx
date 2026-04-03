"use client";

import { useState } from "react";
import Image from "next/image";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import { PUBLIC_FORM_SUBMIT_AJAX_URL } from "@/app/config/constants";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next =
      name === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: next,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!PUBLIC_FORM_SUBMIT_AJAX_URL) {
      console.error("Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local for form submissions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(PUBLIC_FORM_SUBMIT_AJAX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dark:bg-darkmode lg:pb-24 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="grid md:grid-cols-12 grid-cols-1 gap-6 sm:gap-8 items-start md:items-center">
          <div className="md:col-span-6 min-w-0 w-full">
            <h2 className="max-w-full md:max-w-72 text-xl xs:text-2xl sm:text-3xl md:text-4xl leading-[1.2] font-bold mb-6 sm:mb-9 text-midnight_text dark:text-white">
              Get in Touch
            </h2>
            {showSuccess && (
              <SuccessPopup
                message="Thank you! We'll get back to you soon."
                onClose={() => setShowSuccess(false)}
                autoCloseMs={3000}
              />
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 bg-white dark:bg-darklight border border-border dark:border-dark_border rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <div>
                <label htmlFor="name" className="pb-3 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Name*
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
                <label htmlFor="email" className="pb-3 inline-block text-base font-medium text-midnight_text dark:text-white">
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
                <label htmlFor="phone" className="pb-3 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Phone Number*
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]*"
                  className="w-full text-base px-4 py-2.5 rounded-lg border border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode text-midnight_text dark:text-white transition-all duration-500 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-darklight focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="message" className="pb-3 inline-block text-base font-medium text-midnight_text dark:text-white">
                  Message*
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
                  className="bg-primary rounded-lg text-white py-4 px-8 mt-4 inline-block hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
          <div className="md:col-span-6 h-[280px] sm:h-[360px] md:h-[480px] lg:h-[600px] relative w-full min-h-0 order-first md:order-none">
            <Image
              src="/images/contact-page/contact.jpg"
              alt="Contact"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
