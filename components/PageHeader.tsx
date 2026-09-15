import Reveal from "./Reveal";
import { Palmette } from "./Ornaments";

export default function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-[#f7f2e8] px-5 pb-14 pt-[130px] text-center md:px-10 md:pb-20 md:pt-[180px]">
      <Reveal>
        {eyebrow && <p className="eyebrow text-[#a8863f]">{eyebrow}</p>}
        <h1 className="display mx-auto mt-5 max-w-3xl text-[32px] md:text-[46px]">{title}</h1>
        {lead && (
          <p className="lead mx-auto mt-6 max-w-2xl text-[#7c7365]">{lead}</p>
        )}
        <Palmette className="mx-auto mt-9 h-8 w-11 text-[#a8863f]/55" />
      </Reveal>
    </section>
  );
}
