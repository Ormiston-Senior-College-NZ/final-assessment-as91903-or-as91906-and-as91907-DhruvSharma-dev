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
        <div className="flex justify-center gap-2">

          <button
            className="
              min-w-37.5
              h-11
              border
              border-[#C49A00]
              rounded-md
              bg-white
              text-sm
              transition
              hover:bg-gray-50
            "
          >
            Norms
          </button>

          <button
            className="
              min-w-37.5
              h-11
              border
              border-[#C49A00]
              rounded-md
              bg-white
              text-sm
              transition
              hover:bg-gray-50
            "
          >
            Kamar Portal
          </button>

          <button
            className="
              min-w-37.5
              h-11
              border
              border-[#C49A00]
              rounded-md
              bg-white
              text-sm
              transition
              hover:bg-gray-50
            "
          >
            Wi-Fi Setup
          </button>

          <button
            className="
              min-w-37.5
              h-11
              border
              border-[#C49A00]
              rounded-md
              bg-white
              text-sm
              transition
              hover:bg-gray-50
            "
          >
            School Clubs
          </button>

          <button
            className="
              min-w-37.5
              h-11
              border
              border-[#C49A00]
              rounded-md
              bg-white
              text-sm
              transition
              hover:bg-gray-50
            "
          >
            I-Time Tutorials
          </button>

        </div>
      </div>
    </div>
  );
}