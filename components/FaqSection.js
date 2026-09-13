'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    q: 'How do pickup games work on Hooperzclub?',
    a: 'Simply browse active pickup games in your city. Each game listing details the court location, surface type (indoor hardwood or outdoor asphalt), skill level, and entry slots. You can RSVP with a tap, show up, and play without any awkward court arguments.',
  },
  {
    q: 'Can I register as an individual player (Free Agent) without a squad?',
    a: 'Absolutely! If you don’t have a full 3v3 or 5v5 team, you can sign up as a Free Agent. Tournament organizers and squad captains frequently draft free agents onto their rosters, or our matchmaking groups free agents together into a scratch squad.',
  },
  {
    q: 'How does the automated tournament bracket generator work?',
    a: 'Organizers select single-elimination or double-elimination, input team count, and configure seeds. The platform automatically draws fixtures, assigns court numbers and match times, handles bye progression, and updates the live public bracket in real-time as scores are reported.',
  },
  {
    q: 'How do court owners or facility managers list their venues?',
    a: 'Facility managers can register their basketball courts through our partner onboarding. You can set hourly court booking fees, define peak/non-peak slots, specify amenities (floodlights, indoor wooden flooring, shower/lockers), and receive verified bookings directly.',
  },
  {
    q: 'Is Hooperzclub free to join for regular players?',
    a: 'Yes, creating an account, finding public pickup runs, and having your Hooperz Player Profile is 100% free. Paid tournaments or private indoor court bookings specify their transparent entry fees upfront with zero hidden charges.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Got Questions?</p>
          <h2 className="mt-4 font-cursive text-5xl text-black md:text-6xl font-normal">
            Court FAQs & Rules.
          </h2>
          <p className="mt-3 text-sm text-black/65 md:text-base">
            Everything you need to know about joining runs, organizing tournaments, and court bookings.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-black/10 bg-[#f9f9f9] transition duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-black md:text-lg"
                >
                  <span>{faq.q}</span>
                  <span className={`ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180 bg-red-600 text-white' : 'text-black'}`}>
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-black/5 px-5 pb-5 pt-2 text-sm leading-relaxed text-black/70">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-black/10 bg-black/5 p-6 text-center text-sm text-black/70">
          Have another question or want to partner your court?{' '}
          <Link href="/contact" className="font-bold text-red-600 hover:underline">
            Reach out to our court crew →
          </Link>
        </div>
      </div>
    </section>
  );
}
