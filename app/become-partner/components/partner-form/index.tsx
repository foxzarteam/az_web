"use client";

import { useState } from "react";
import { CONTACT, PUBLIC_FORM_SUBMIT_AJAX_URL } from "@/app/config/constants";
import SuccessPopup from "@/app/components/shared/SuccessPopup";

export default function PartnerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
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

    if (!PUBLIC_FORM_SUBMIT_AJAX_URL) {
      console.error("Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local for form submissions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(PUBLIC_FORM_SUBMIT_AJAX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: "Partner Registration Request",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
        setShowSuccess(true);
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
            {showSuccess && (
              <SuccessPopup
                message="Thank you! We'll contact you soon to discuss partnership opportunities."
                onClose={() => setShowSuccess(false)}
                autoCloseMs={3000}
              />
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
