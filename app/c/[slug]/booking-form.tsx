"use client";

import { useEffect, useRef, useState } from "react";

type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
  slot_duration_minutes: number;
};

type BookingStatus = "idle" | "loading" | "done" | "error";

type BookingResult = {
  doctorName: string;
  date: string;
  time: string;
  name: string;
};

type BookingFormProps = {
  clinicSlug: string;
  doctors: Doctor[];
  clinicPhone: string | null;
};

function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookingForm({
  clinicSlug,
  doctors,
  clinicPhone,
}: BookingFormProps) {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [doctorOpen, setDoctorOpen] = useState(false);

  const [status, setStatus] =
    useState<BookingStatus>("idle");

  const [errorMsg, setErrorMsg] = useState("");

  const [result, setResult] =
    useState<BookingResult | null>(null);

  const doctorMenuRef =
    useRef<HTMLDivElement | null>(null);

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === doctorId
  );

  /*
   * إغلاق قائمة الأطباء عند الضغط خارجها
   */
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        doctorMenuRef.current &&
        !doctorMenuRef.current.contains(target)
      ) {
        setDoctorOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * اختيار الطبيب
   */
  function handleDoctorSelect(id: string) {
    setDoctorId(id);
    setDoctorOpen(false);

    // عند تغيير الطبيب نرجع نمسح الوقت
    setTime("");
  }

  /*
   * إرسال الحجز
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMsg("");

    /*
     * التحقق من البيانات
     */
    if (!doctorId) {
      setStatus("error");
      setErrorMsg("يرجى اختيار الطبيب.");
      return;
    }

    if (!date) {
      setStatus("error");
      setErrorMsg("يرجى اختيار اليوم.");
      return;
    }

    if (!time) {
      setStatus("error");
      setErrorMsg("يرجى اختيار الوقت.");
      return;
    }

    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("يرجى إدخال اسمك.");
      return;
    }

    if (!phone.trim()) {
      setStatus("error");
      setErrorMsg("يرجى إدخال رقم الهاتف.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/book", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          clinicSlug,
          doctorId,
          date,
          time,
          patientName: name.trim(),
          patientPhone: phone.trim(),
        }),
      });

      let data: { error?: string } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setStatus("error");

        setErrorMsg(
          data.error ||
            "صار خطأ أثناء الحجز، حاول مرة ثانية."
        );

        return;
      }

      setResult({
        doctorName:
          selectedDoctor?.full_name || "الطبيب",
        date,
        time,
        name: name.trim(),
      });

      setStatus("done");
    } catch {
      setStatus("error");

      setErrorMsg(
        "تعذر الاتصال بالخادم. تأكد من الإنترنت وحاول مرة ثانية."
      );
    }
  }

  /*
   * شاشة نجاح الحجز
   */
  if (status === "done" && result) {
    const whatsappMessage = encodeURIComponent(
      `تأكيد حجز
الطبيب: ${result.doctorName}
التاريخ: ${result.date}
الوقت: ${result.time}
المريض: ${result.name}`
    );

    const cleanPhone = clinicPhone
      ? clinicPhone.replace(/[^0-9]/g, "")
      : "";

    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
      : `https://wa.me/?text=${whatsappMessage}`;

    return (
      <div
        className="
          rounded-3xl
          border
          border-[#1CBCCF]/30
          bg-white
          p-6
          shadow-sm
        "
      >
        <div
          className="
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#E8F8FA]
            text-2xl
            font-bold
            text-[#0e8a99]
          "
        >
          ✓
        </div>

        <h2
          className="
            mb-4
            text-xl
            font-bold
            text-[#0e8a99]
          "
        >
          تم حجز موعدك بنجاح
        </h2>

        <div className="space-y-2 text-sm text-[#4C5354]">
          <p>
            <span className="font-bold text-[#111]">
              الطبيب:
            </span>{" "}
            {result.doctorName}
          </p>

          <p>
            <span className="font-bold text-[#111]">
              التاريخ:
            </span>{" "}
            {result.date}
          </p>

          <p>
            <span className="font-bold text-[#111]">
              الوقت:
            </span>{" "}
            {result.time}
          </p>

          <p>
            <span className="font-bold text-[#111]">
              الاسم:
            </span>{" "}
            {result.name}
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-5
            block
            rounded-2xl
            bg-green-600
            px-4
            py-3
            text-center
            font-bold
            text-white
            transition-opacity
            hover:opacity-90
          "
        >
          إرسال التفاصيل عبر واتساب
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* =========================
          الطبيب
      ========================== */}

      <div
        ref={doctorMenuRef}
        className="relative"
      >
        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-[#111]
          "
        >
          الطبيب
        </label>

        <button
          type="button"
          onClick={() =>
            setDoctorOpen((open) => !open)
          }
          aria-haspopup="listbox"
          aria-expanded={doctorOpen}
          className={`
            flex
            min-h-[56px]
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            bg-white
            px-4
            text-right
            shadow-sm
            outline-none
            transition
            ${
              doctorOpen
                ? "border-[#1CBCCF] ring-4 ring-[#1CBCCF]/15"
                : "border-black/10"
            }
          `}
        >
          <span
            className={
              selectedDoctor
                ? "text-[#111]"
                : "text-[#737B7D]"
            }
          >
            {selectedDoctor
              ? `${selectedDoctor.full_name} — ${selectedDoctor.specialty}`
              : "اختر الطبيب"}
          </span>

          <span
            className={`
              mr-3
              text-xl
              text-[#596164]
              transition-transform
              ${
                doctorOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          >
           ⌄
          </span>
        </button>

        {/* القائمة المخصصة */}
        {doctorOpen && (
          <div
            role="listbox"
            className="
              absolute
              inset-x-0
              z-50
              mt-2
              max-h-64
              overflow-y-auto
              rounded-2xl
              border
              border-black/10
              bg-white
              p-2
              shadow-xl
            "
          >
            {doctors.length === 0 ? (
              <div
                className="
                  px-4
                  py-4
                  text-center
                  text-sm
                  text-[#737B7D]
                "
              >
                لا يوجد أطباء متاحون
              </div>
            ) : (
              doctors.map((doctor) => {
                const isSelected =
                  doctor.id === doctorId;

                return (
                  <button
                    key={doctor.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() =>
                      handleDoctorSelect(
                        doctor.id
                      )
                    }
                    className={`
                      mb-1
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3
                      text-right
                      transition
                      last:mb-0
                      ${
                        isSelected
                          ? "bg-[#E8F8FA]"
                          : "hover:bg-[#F5F7F7]"
                      }
                    `}
                  >
                    <span>
                      <span
                        className={`
                          block
                          font-semibold
                          ${
                            isSelected
                              ? "text-[#0e8a99]"
                              : "text-[#111]"
                          }
                        `}
                      >
                        {doctor.full_name}
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-xs
                          text-[#737B7D]
                        "
                      >
                        {doctor.specialty}
                      </span>
                    </span>

                    {isSelected && (
                      <span
                        className="
                          text-lg
                          font-bold
                          text-[#1CBCCF]
                        "
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* =========================
          اليوم
      ========================== */}

      <div>
        <label
          htmlFor="booking-date"
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-[#111]
          "
        >
          اليوم
        </label>

        <input
          id="booking-date"
          required
          type="date"
          min={getTodayDate()}
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          className="
            min-h-[56px]
            w-full
            appearance-none
            rounded-2xl
            border
            border-black/10
            bg-white
            px-4
            text-[#111]
            shadow-sm
            outline-none
            transition
            focus:border-[#1CBCCF]
            focus:ring-4
            focus:ring-[#1CBCCF]/15
          "
        />
      </div>

      {/* =========================
          الوقت
      ========================== */}

      <div>
        <label
          htmlFor="booking-time"
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-[#111]
          "
        >
          الوقت
        </label>

        <input
          id="booking-time"
          required
          type="time"
          step={
            selectedDoctor?.slot_duration_minutes
              ? selectedDoctor.slot_duration_minutes *
                60
              : 1800
          }
          value={time}
          onChange={(event) =>
            setTime(event.target.value)
          }
          className="
            min-h-[56px]
            w-full
            appearance-none
            rounded-2xl
            border
            border-black/10
            bg-white
            px-4
            text-[#111]
            shadow-sm
            outline-none
            transition
            focus:border-[#1CBCCF]
            focus:ring-4
            focus:ring-[#1CBCCF]/15
          "
          dir="ltr"
        />
      </div>

      {/* =========================
          الاسم
      ========================== */}

      <div>
        <label
          htmlFor="patient-name"
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-[#111]
          "
        >
          اسمك
        </label>

        <input
          id="patient-name"
          required
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="اكتب اسمك الكامل"
          autoComplete="name"
          className="
            min-h-[56px]
            w-full
            rounded-2xl
            border
            border-black/10
            bg-white
            px-4
            text-[#111]
            shadow-sm
            outline-none
            transition
            placeholder:text-[#A0A6A7]
            focus:border-[#1CBCCF]
            focus:ring-4
            focus:ring-[#1CBCCF]/15
          "
        />
      </div>

      {/* =========================
          رقم الهاتف
      ========================== */}

      <div>
        <label
          htmlFor="patient-phone"
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-[#111]
          "
        >
          رقم الهاتف
        </label>

        <input
          id="patient-phone"
          required
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
          placeholder="07xxxxxxxxx"
          autoComplete="tel"
          dir="ltr"
          className="
            min-h-[56px]
            w-full
            rounded-2xl
            border
            border-black/10
            bg-white
            px-4
            text-[#111]
            shadow-sm
            outline-none
            transition
            placeholder:text-[#A0A6A7]
            focus:border-[#1CBCCF]
            focus:ring-4
            focus:ring-[#1CBCCF]/15
          "
        />
      </div>

      {/* =========================
          الخطأ
      ========================== */}

      {status === "error" && (
        <div
          role="alert"
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {errorMsg}
        </div>
      )}

      {/* =========================
          تأكيد الحجز
      ========================== */}

      <button
        type="submit"
        disabled={
          status === "loading" ||
          doctors.length === 0
        }
        className="
          min-h-[58px]
          w-full
          rounded-full
          bg-[#1CBCCF]
          px-5
          py-3
          text-base
          font-bold
          text-white
          shadow-sm
          transition-colors
          hover:bg-[#17a3b4]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {status === "loading"
          ? "جاري الحجز..."
          : "تأكيد الحجز"}
      </button>
    </form>
  );
}
