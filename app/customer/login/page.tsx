import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCustomerSession } from "@/app/lib/customer/session";
import CustomerLoginForm from "./CustomerLoginForm";

export default async function CustomerLoginPage() {
  const session = await getCustomerSession();
  if (session) redirect("/customer/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f2]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(66,54,251,0.14), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(255,122,26,0.12), transparent), linear-gradient(180deg, #faf8f5 0%, #f0ebe3 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8 sm:px-6">
        <Link href="/" className="mb-8 inline-flex self-start" aria-label="Apni Zaroorat home">
          <Image
            src="/images/logo/logo.webp"
            alt="Apni Zaroorat"
            width={220}
            height={56}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex flex-1 items-center justify-center pb-12">
          <CustomerLoginForm />
        </div>
      </div>
    </main>
  );
}
