import { CONTACT } from "@/app/config/constants";

export default function ContactInfo() {
  return (
    <section className="dark:bg-darkmode pt-6 sm:pt-8 pb-0">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="flex md:flex-row flex-col lg:items-center items-start justify-center md:gap-12 lg:gap-28 gap-6 sm:gap-8">
          <div className="flex sm:flex-row flex-col items-start sm:gap-6 md:gap-8 gap-4 w-full min-w-0">
            <div className="bg-primary/20 w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 flex items-center justify-center rounded-full shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between min-w-0">
              <div className="min-w-0">
                <span className="text-midnight_text dark:text-white text-lg sm:text-xl font-bold">
                  Email Us
                </span>
                <p className="text-midnight_text/70 font-normal text-sm sm:text-base md:text-xl max-w-full md:max-w-80 pt-2 sm:pt-3 pb-4 sm:pb-7 dark:text-gray break-words">
                  Feel free to contact us at {CONTACT.EMAIL}
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col items-start sm:gap-6 md:gap-8 gap-4 w-full min-w-0">
            <div className="bg-primary/20 w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 flex items-center justify-center rounded-full shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between min-w-0">
              <div className="min-w-0">
                <span className="text-midnight_text dark:text-white text-lg sm:text-xl font-bold">
                  Phone Number
                </span>
                <p className="text-midnight_text/70 font-normal text-sm sm:text-base md:text-xl max-w-full md:max-w-80 pt-2 sm:pt-3 pb-4 sm:pb-7 dark:text-gray break-words">
                  Feel free to contact us at <a href="tel:9351283215" className="hover:text-primary transition-colors">9351283215</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:pt-16 pt-8 sm:pt-11 md:pb-16 pb-8 px-4 sm:px-6">
        <div className="rounded-lg overflow-hidden w-full min-h-[220px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[477px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d938779.7831767448!2d71.05098621661072!3d23.20271516446136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e82dd003ff749%3A0x359e803f537cea25!2sGANESH%20GLORY%2C%20Gota%2C%20Ahmedabad%2C%20Gujarat%20382481!5e0!3m2!1sen!2sin!4v1715676641521!5m2!1sen!2sin" 
            width="100%" 
            height="100%"
            style={{ minHeight: "220px" }}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade" 
            className="rounded-lg w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[477px] border-0"
            title="Office Location"
          />
        </div>
      </div>
      <div className="border-b border-solid border-border dark:border-dark_border"></div>
    </section>
  );
}
