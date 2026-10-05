import React from "react";
import { Download, Smartphone, ShieldCheck, QrCode, Nfc } from "lucide-react";

const IDEaseDownload = () => {
  return (
    <section className="w-full px-4 py-16">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-sm">
        <div className="grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-14">

          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm font-medium text-green-700 shadow-sm">
              <Smartphone size={16} />
              Android App
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your university ID,
              <span className="block text-green-600">
                in your phone.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-base leading-7 text-gray-600">
              Access campus services using your digital identity,
              QR and NFC — all from the IDEase mobile app.
            </p>

            {/* Download */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/downloads/IDEase.apk"
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 active:scale-[0.98]"
              >
                <Download size={19} />
                Download for Android
              </a>
            </div>

            {/* Version */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span>Version 1.1.0</span>
              <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />
              <span>Android APK</span>
              <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />
              <span>25 MB</span>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-xl shadow-green-900/5">

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <Smartphone size={28} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    IDEase
                  </p>
                  <p className="text-sm text-gray-500">
                    Digital University ID
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <QrCode className="mx-auto mb-2 text-green-600" size={22} />
                  <p className="text-xs font-medium text-gray-600">
                    QR Access
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <Nfc className="mx-auto mb-2 text-green-600" size={22} />
                  <p className="text-xs font-medium text-gray-600">
                    NFC
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <ShieldCheck
                    className="mx-auto mb-2 text-green-600"
                    size={22}
                  />
                  <p className="text-xs font-medium text-gray-600">
                    Secure
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-800">
                  Built for university access
                </p>
                <p className="mt-1 text-xs leading-5 text-green-700">
                  Carry your digital identity wherever you go on campus.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Installation instructions */}
        <div className="border-t border-green-100 bg-white/70 px-6 py-7 sm:px-10 lg:px-14">
          <h3 className="font-semibold text-gray-900">
            How to install
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Download the APK"],
              ["02", "Open the downloaded file"],
              ["03", "Allow installation from this source"],
              ["04", "Install IDEase"],
            ].map(([number, text]) => (
              <div
                key={number}
                className="flex items-start gap-3 rounded-xl bg-gray-50 p-3"
              >
                <span className="text-xs font-bold text-green-600">
                  {number}
                </span>

                <span className="text-sm text-gray-600">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Android may ask you to allow installation from your browser or
            file manager. This is normal when installing an APK outside
            Google Play.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IDEaseDownload;