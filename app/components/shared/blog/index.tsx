import Link from "next/link";
import Image from "next/image";

const BLOG_POSTS = [
  { title: "How to Choose the Right Personal Loan", excerpt: "Compare interest rates, tenure, and processing fees before you apply.", slug: "#", coverImage: "/images/blog/blog-image.jpg", date: "15 Jan 2024" },
  { title: "Credit Card vs Personal Loan: When to Use Which", excerpt: "Understand the difference and pick the right option for your needs.", slug: "#", coverImage: "/images/blog/blogdetail-1.jpg", date: "20 Jan 2024" },
];

export default function BlogSmall() {
  return (
    <section id="blog" className="flex flex-col dark:bg-darkmode px-4">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md max-w-full">
        <div className="items-center sm:mb-11 mb-7 flex justify-center">
          <h2 className="text-2xl sm:text-4xl text-midnight_text dark:text-white text-center font-bold">Tips & Articles</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {BLOG_POSTS.map((blog, i) => (
            <div key={i} className="w-full" data-aos="fade-up" data-aos-delay={i * 200} data-aos-duration="1000">
              <Link href={blog.slug} className="group block bg-white dark:bg-darklight rounded-lg overflow-hidden shadow-property">
                <div className="imageContainer h-48 w-full">
                  <Image src={blog.coverImage} alt={blog.title} width={600} height={240} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray mb-2">{blog.date}</p>
                  <h3 className="text-xl font-bold text-midnight_text dark:text-white group-hover:text-primary mb-2">{blog.title}</h3>
                  <p className="text-gray text-base">{blog.excerpt}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
