import { CONTACT } from "@/app/config/constants";

export default function ContactInfo() {
  return (
    <section className="dark:bg-darkmode pt-8 pb-0 px-4">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="flex md:flex-row flex-col lg:items-center items-start justify-center md:gap-28 gap-8">
          <div className="flex sm:flex-row flex-col items-start sm:gap-8 gap-4">
            <div className="bg-primary/20 w-15 h-15 flex items-center justify-center rounded-full shrink-0">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between">
              <div>
                <span className="text-midnight_text dark:text-white text-xl font-bold">
                  Email Us
                </span>
                <p className="text-midnight_text/70 font-normal text-xl max-w-80 pt-3 pb-7 dark:text-gray">
                  Feel free to contact us at {CONTACT.EMAIL}
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col items-start sm:gap-8 gap-4">
            <div className="bg-primary/20 w-15 h-15 flex items-center justify-center rounded-full shrink-0">
              <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex md:flex-col sm:flex-row flex-col md:items-start sm:items-center items-start h-full justify-between">
              <div>
                <span className="text-midnight_text dark:text-white text-xl font-bold">
                  Address
                </span>
                <p className="text-midnight_text/70 font-normal text-xl max-w-80 pt-3 pb-7 dark:text-gray">
                  Apni Zaroorat – Loans, Insurance & Credit Cards Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:pt-16 pt-11 md:pb-16 pb-8">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d938779.7831767448!2d71.05098621661072!3d23.20271516446136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e82dd003ff749%3A0x359e803f537cea25!2sGANESH%20GLORY%2C%20Gota%2C%20Ahmedabad%2C%20Gujarat%20382481!5e0!3m2!1sen!2sin!4v1715676641521!5m2!1sen!2sin" 
          width="100%" 
          height="477" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade" 
          className="rounded-lg w-full"
          title="Office Location"
        />
      </div>
      <div className="border-b border-solid border-border dark:border-dark_border"></div>
    </section>
  );
}
