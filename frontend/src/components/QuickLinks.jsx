import { Link } from "react-router-dom";

const quickLinkClass = `
  flex
  h-11
  min-w-44
  flex-1
  items-center
  justify-center
  rounded-md
  border
  border-[#C49A00]
  bg-white
  px-5
  text-sm
  font-medium
  transition
  hover:bg-gray-50
`;

export default function QuickLinks() {
  return (
    <div className="fixed bottom-4 left-6 right-6 z-50">
      <div
        className="
          bg-white
          rounded-xl
          shadow-md
          border
          border-[#C49A00]
          px-4
          py-3
        "
      >
        <div className="flex flex-wrap justify-center gap-2">

          {/* Internal Page */}
          <Link
            to="/norms"
            className={quickLinkClass}
          >
            Norms
          </Link>

          {/* External Links */}

          <a
            href="https://ormiston.school.kiwi/"
            target="_blank"
            rel="noopener noreferrer"
            className={quickLinkClass}
          >
            Kamar Portal
          </a>

          <a
            href="https://drive.google.com/drive/folders/132RJOXYCqDDaKhRiS3AfWgMS6K676BiE?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className={quickLinkClass}
          >
            Wi-Fi Setup
          </a>

          <a
            href="https://docs.google.com/spreadsheets/d/1gjfaDCoq37gcznVxVUboHnfdCc43wJjR5Z-bd2BQcgQ/edit?gid=1149952797#gid=1149952797"
            target="_blank"
            rel="noopener noreferrer"
            className={quickLinkClass}
          >
            School Clubs
          </a>

          <a
            href="https://docs.google.com/spreadsheets/d/1_qqpln-KH4U-Iuwl46oOmiXY58sk4GyxAgSK0MMilKM/edit?gid=105554696#gid=105554696"
            target="_blank"
            rel="noopener noreferrer"
            className={quickLinkClass}
          >
            I-Time Tutorials
          </a>

        </div>
      </div>
    </div>
  );
}
