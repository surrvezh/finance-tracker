import ReactMarkdown from "react-markdown";

export function InsightReport({ report }: { report: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-white prose-headings:font-semibold
      prose-p:text-zinc-300 prose-p:leading-relaxed
      prose-strong:text-white prose-li:text-zinc-300
      prose-h2:text-base prose-h3:text-sm
    ">
      <ReactMarkdown>{report}</ReactMarkdown>
    </div>
  );
}
