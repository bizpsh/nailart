import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">문의하기</h1>
      <p className="mt-2 text-sm opacity-70">
        원하시는 네일아트 디자인이나 예약 관련 문의사항을 남겨주시면 빠르게
        답변드리겠습니다.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
