import StaticPageShell from "@/components/StaticPageShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact — GentlemanVibe Time",
  description:
    "GentlemanVibe Time에 대한 문의, 제안, 버그 신고는 이메일로 보내주세요.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPageShell title="Contact Us">
      <p>
        GentlemanVibe Time에 대한 문의, 제안, 버그 신고는 아래 이메일로
        보내주세요.
      </p>
      <p>
        <a
          href="mailto:novamedia101@gmail.com"
          className="text-gv-amber underline underline-offset-2"
        >
          novamedia101@gmail.com
        </a>
      </p>
      <p>가능한 빠르게 답변드리겠습니다.</p>
    </StaticPageShell>
  );
}
