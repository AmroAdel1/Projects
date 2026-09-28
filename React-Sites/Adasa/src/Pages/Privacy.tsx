import { Link } from "react-router-dom"
import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react"
import { formattedDate } from "@/utils/utils"

export default function Privacy() {
  return (
    <div>
      <main className="grow pt-20">
        <div className="bg-[#0a0a0a]">
          <header className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-size-[60px_60px]" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
            </div>
            <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <nav className="mb-8 flex items-center justify-center gap-2 text-sm">
                <Link
                  className="text-neutral-400 transition-colors hover:text-white"
                  to="/"
                  data-discover="true"
                >
                  Home
                </Link>
                <i className="fa-solid fa-chevron-right text-neutral-600"></i>
                <span className="font-medium text-orange-500">
                  Privacy Policy
                </span>
              </nav>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm">
                <LockKeyhole className="h-8 w-8 text-orange-500" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Privacy Policy
              </h1>
              <p className="text-lg text-neutral-400">
                Last updated: {formattedDate}
              </p>
            </div>
          </header>
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <ShieldCheck className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-orange-500">
                    Your privacy matters to us
                  </h3>
                  <p className="text-sm text-orange-300/80">
                    We are committed to protecting your personal information and
                    being transparent about what we collect.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-12">
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    1
                  </span>
                  Introduction
                </h2>
                <div className="pr-11">
                  <p className="leading-relaxed text-neutral-400">
                    Welcome to Adasa. We respect your privacy and are committed
                    to protecting your personal data. This privacy policy will
                    inform you about how we take care of your personal data when
                    you visit our website and tell you about your privacy
                    rights.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    2
                  </span>
                  Information We Collect
                </h2>
                <div className="pr-11">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        <strong className="text-white">Identity Data: </strong>
                        It includes first name, last name, username, or similar
                        identifier.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        <strong className="text-white">
                          Contact Details:{" "}
                        </strong>
                        It includes the email address.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        <strong className="text-white">Technical Data: </strong>
                        It includes the IP address, browser type, time zone, and
                        operating system.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        <strong className="text-white">Usage data: </strong>
                        It includes information about how you use our website
                        and services.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    3
                  </span>
                  How we use your information
                </h2>
                <div className="pr-11">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>To provide and maintain our service</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>To notify you of changes to our service</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>To provide customer support</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        To gather analytics or valuable information to improve
                        our service.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>To monitor the use of our service</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        To detect, prevent, and address technical issues.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    4
                  </span>
                  Cookies
                </h2>
                <div className="pr-11">
                  <p className="leading-relaxed text-neutral-400">
                    We use cookies and similar tracking technologies to track
                    activity on our website. You can instruct your browser to
                    refuse all cookies or to indicate when a cookie is being
                    sent. However, if you do not accept cookies, you may not be
                    able to use some parts of our website.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    5
                  </span>
                  Data Security
                </h2>
                <div className="pr-11">
                  <p className="leading-relaxed text-neutral-400">
                    We have implemented appropriate security measures to prevent
                    your personal data from being accidentally lost, used, or
                    accessed in an unauthorized manner. We limit access to your
                    personal data to those who have a business need to know.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    6
                  </span>
                  Your Rights
                </h2>
                <div className="pr-11">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>Request to access your personal data</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>Request to correct your personal data</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>Request to delete your personal data</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        Objecting to the processing of your personal data
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>
                        Request to restrict the processing of your personal data
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-orange-500 text-black" />
                      <span>Right to withdraw consent</span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    7
                  </span>
                  Contact us
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    If you have any questions about this Privacy Policy, please
                    contact us:
                  </p>
                  <a
                    href="mailto:hello@adasah.com"
                    className="inline-flex items-center gap-2 font-medium text-orange-500 hover:text-orange-400"
                  >
                    <i className="fa-regular fa-envelope"></i>
                    hello@adasah.com
                  </a>
                </div>
              </section>
            </div>
            <div className="mt-16 border-t border-[#262626] pt-8">
              <p className="text-center text-sm text-neutral-500">
                By using our website, you agree to this Privacy Policy. See also
                the
                <Link
                  className="m-0.75 font-medium text-orange-500 hover:text-orange-400"
                  to="/terms"
                  data-discover="true"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
