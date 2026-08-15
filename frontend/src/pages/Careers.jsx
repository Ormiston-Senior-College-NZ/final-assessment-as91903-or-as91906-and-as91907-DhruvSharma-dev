// Careers page. Staff cards are fixed presentation content, while the support title
// and message are teacher-editable. The local value renders first and is replaced by
// the shared SQLite value after the asynchronous request finishes.
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";
import Layout from "../components/Layout";
import {
  getStoredCareersSupport,
  loadStoredCareersSupport,
} from "../data/studentNetData";
import andreaDalyPhoto from "../assets/Andrea-Daly.jpg";
import andrewJohnsonPhoto from "../assets/Andrew-Johnson.png";
import lindaScottPhoto from "../assets/Linda-Scott.jpg";
import umaniGanegamaPhoto from "../assets/Umani-Ganegama.png";

const careersStaff = [
  // Store each careers staff member and their booking link here.
  {
    name: "Andrea Daly",
    role: "Careers Advisor",
    photoUrl: andreaDalyPhoto,
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Np786GKGkxv8ynyh7kmLC_RW93R36wY1Z3T2xchJETqSVryCrC_QPiDfDFibgnmuVDDC6BkfG",
  },
  {
    name: "Linda Scott",
    role: "Pathways Support",
    photoUrl: lindaScottPhoto,
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3VP4cYDCOsgz2zgFZBCP61ImCxV-91ruCD_exaDeHqR27wdygI5b2aPYdWsA7yURaqCt4FY79-",
  },
  {
    name: "Andrew Johnson",
    role: "Gateway Coordinator",
    photoUrl: andrewJohnsonPhoto,
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2A231rGol0l3ku3l23zXPerFWmjySB2Vk91GO2X2MllhneacurBMxb23nAjh12KgyI0CRFosiM",
  },
  {
    name: "Umani Ganegama",
    role: "Careers Support",
    photoUrl: umaniGanegamaPhoto,
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3ug0tQzedkU_TRl9-TZFcLV4vY-6aP0tIVTnx9hZoKLO59k6kOEJvrn6lwrOqkTLs5I6WmmjfE",
  },
];

function StaffCard({ name, role, photoUrl, bookingUrl, highlight }) {
  // The fade makes the name easier to read over the photo.
  // Boolean changes a possible string or empty value into a clear true/false.
  const hasBookingLink = Boolean(bookingUrl);
  const hasPhoto = Boolean(photoUrl);

  // Use a clickable link when booking is available, otherwise use a normal article.
  const CardElement = hasBookingLink ? "a" : "article";

  return (
    <CardElement
      href={hasBookingLink ? bookingUrl : undefined}
      target={hasBookingLink ? "_blank" : undefined}
      rel={hasBookingLink ? "noopener noreferrer" : undefined}
      aria-label={hasBookingLink ? `Book an appointment with ${name}` : undefined}
      className={`
        relative
        block
        min-h-136
        overflow-hidden
        rounded-lg
        border
        border-[#F2901D]
        bg-white
        shadow-sm
        ${
          hasBookingLink
            ? "transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F2901D] focus:ring-offset-2"
            : ""
        }
      `}
    >
      {hasPhoto && (
        // Do not create a broken image element when there is no staff photo.
        <img
          src={photoUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* This colour fade keeps dark and light photos readable. */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-[#FFC06E] via-[#FFF8EC]/70 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-7 pt-24 text-center">
        <p className="text-2xl font-bold uppercase text-gray-950">
          <HighlightText text={name} highlight={highlight} />
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-800">
          <HighlightText text={role} highlight={highlight} />
        </p>
      </div>
    </CardElement>
  );
}

export default function Careers() {
  // Get the navbar search word from the URL.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";

  // Show locally saved careers text first while checking the shared database.
  const [careersSupport, setCareersSupport] = useState(() =>
    getStoredCareersSupport(),
  );

  useEffect(() => {
    // Get the careers message saved by a teacher.
    loadStoredCareersSupport().then(setCareersSupport);
  }, []);

  return (
    <Layout>
      <section className="space-y-4">
        {/* Staff cards stack on phones and spread into four columns on wide screens. */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {careersStaff.map((staffMember) => (
            // Spread passes name, role, photoUrl and bookingUrl into StaffCard.
            <StaffCard
              key={staffMember.name}
              highlight={highlight}
              {...staffMember}
            />
          ))}
        </div>

        <p className="text-center text-base text-white">
          <span className="font-bold">Note:</span> clicking on the name, will take you to the booking page
        </p>

        {/* Teachers can edit this support message from the Teacher Panel. */}
        <article className="rounded-lg border border-[#F2901D] bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-950">
            <HighlightText text={careersSupport.title} highlight={highlight} />
          </h1>

          <p className="mt-3 max-w-5xl whitespace-pre-wrap break-words text-lg leading-8 text-gray-700">
            <HighlightText text={careersSupport.message} highlight={highlight} />
          </p>
        </article>
      </section>
    </Layout>
  );
}
