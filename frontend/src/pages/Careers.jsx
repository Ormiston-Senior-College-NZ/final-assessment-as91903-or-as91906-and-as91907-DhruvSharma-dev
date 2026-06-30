import Layout from "../components/Layout";

const careersStaff = [
  {
    name: "Andrea Daly",
    role: "Careers Advisor",
    photoUrl: "",
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Np786GKGkxv8ynyh7kmLC_RW93R36wY1Z3T2xchJETqSVryCrC_QPiDfDFibgnmuVDDC6BkfG",
  },
  {
    name: "Linda Scott",
    role: "Pathways Support",
    photoUrl: "",
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3VP4cYDCOsgz2zgFZBCP61ImCxV-91ruCD_exaDeHqR27wdygI5b2aPYdWsA7yURaqCt4FY79-",
  },
  {
    name: "Andrew Johnson",
    role: "Gateway Coordinator",
    photoUrl: "",
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2A231rGol0l3ku3l23zXPerFWmjySB2Vk91GO2X2MllhneacurBMxb23nAjh12KgyI0CRFosiM",
  },
  {
    name: "Umani Ganegama",
    role: "Careers Support",
    photoUrl: "",
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3ug0tQzedkU_TRl9-TZFcLV4vY-6aP0tIVTnx9hZoKLO59k6kOEJvrn6lwrOqkTLs5I6WmmjfE",
  },
];

function StaffCard({ name, photoUrl, bookingUrl }) {
  const hasBookingLink = Boolean(bookingUrl);
  const hasPhoto = Boolean(photoUrl);
  const CardElement = hasBookingLink ? "a" : "article";

  return (
    <CardElement
      href={hasBookingLink ? bookingUrl : undefined}
      target={hasBookingLink ? "_blank" : undefined}
      rel={hasBookingLink ? "noopener noreferrer" : undefined}
      aria-label={hasBookingLink ? `Book an appointment with ${name}` : undefined}
      className={`
        flex
        min-h-136
        flex-col
        justify-end
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
      <div className="flex flex-1 items-center justify-center bg-white">
        {hasPhoto && (
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="bg-linear-to-t from-[#FFC06E] to-[#FFF8EC] px-5 pb-7 pt-20 text-center">
        <p className="text-2xl font-bold uppercase text-gray-950">
          {name}
        </p>
      </div>
    </CardElement>
  );
}

export default function Careers() {
  return (
    <Layout>
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {careersStaff.map((staffMember) => (
            <StaffCard
              key={staffMember.name}
              {...staffMember}
            />
          ))}
        </div>

        <p className="text-center text-base text-white">
          <span className="font-bold">Note:</span> clicking on the name, will take you to the booking page
        </p>
      </section>
    </Layout>
  );
}
