"use client";

import { useState } from "react";
import WaitlistModal from "./WaitlistModal";

export default function Nav() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              ShouldIBuyThis<span className="text-indigo-400">.io</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="#how-it-works"
              className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors"
            >
              How it works
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-white font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
              }}
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
