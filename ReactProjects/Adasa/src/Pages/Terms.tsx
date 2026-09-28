import { formattedDate } from "@/utils/utils"
import { TriangleAlert } from "lucide-react"
import { Link } from "react-router-dom"

export default function Terms() {
  return (
    <div>
      <main className="grow pt-20">
        <div className="bg-[#0a0a0a]">
          <header className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-size-[60px_60px]" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-yellow-500/20 blur-[100px]" />
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
                  Terms of Service
                </span>
              </nav>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm">
                <i className="fa-regular fa-file-lines text-3xl text-orange-500"></i>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Terms of Service
              </h1>
              <p className="text-lg text-neutral-400">
                Last updated: {formattedDate}
              </p>
            </div>
          </header>
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <TriangleAlert className="text-2xl text-yellow-500" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-yellow-500">
                    Important Notice
                  </h3>
                  <p className="text-sm text-yellow-300/80">
                    Please read these Terms of Service carefully before using
                    our website. By accessing or using Lens, you agree to be
                    bound by these terms.
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
                  Acceptance of Terms
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    By accessing or using Adasa, you agree to be bound by these
                    Terms of Service and all applicable laws and regulations. If
                    you do not agree to any of these terms, you are prohibited
                    from using or accessing this site.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    2
                  </span>
                  License of Use
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    Permission is granted to temporarily access the materials on
                    the Adasa website for personal, non-commercial viewing only.
                    This is the grant of a license, not a transfer of title.
                  </p>
                  <p className="mb-3 font-medium text-neutral-300">
                    Under this license, you may not:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>Modifying or copying materials</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>
                        Use of the materials for any commercial purpose or for
                        public display.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>
                        Attempting to decompile or reverse-engineer any software
                        on the site.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>
                        Removing any copyright notices or proprietary markings
                        from the materials.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>
                        Transferring the materials to another person or copying
                        them onto any other server.
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
                  Disclaimer
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    The materials on the Adasa website are provided on an "as
                    is" basis. Adasa makes no warranties, express or implied,
                    and disclaims all other warranties.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    4
                  </span>
                  Constraint
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    In no event shall Adasa or its suppliers be liable for any
                    damages arising from the use or inability to use the
                    materials on the site.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    5
                  </span>
                  User content
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    If you post content on our website (such as comments), you
                    grant us a non-exclusive, worldwide, and royalty-free
                    license to use, reproduce, modify, and distribute that
                    content.
                  </p>
                  <p className="mb-3 font-medium text-neutral-300">
                    Your content must not be:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>To be defamatory, obscene, or offensive.</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>
                        Infringement of others' intellectual property rights
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>Containment of viruses or malicious code</span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>
                        Violation of any applicable laws or regulations
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-neutral-400">
                      <i className="fa-solid fa-xmark mt-0.5 shrink-0 text-red-400"></i>
                      <span>Advertising unauthorized products or services</span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    6
                  </span>
                  Modifications
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    Adasa may revise these Terms of Service at any time without
                    notice. By using this website, you agree to be bound by the
                    current version of the Terms of Service.
                  </p>
                </div>
              </section>
              <section className="group">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 text-lg font-bold text-white">
                    7
                  </span>
                  Contact Information
                </h2>
                <div className="pr-11">
                  <p className="mb-4 leading-relaxed text-neutral-400">
                    If you have any questions about these Terms of Service,
                    please contact us:
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
                By using our website, you agree to these Terms of Service. See
                also the
                <Link
                  className="m-0.75 font-medium text-orange-500 hover:text-orange-400"
                  to="/privacy"
                  data-discover="true"
                >
                  Privacy Policy
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
