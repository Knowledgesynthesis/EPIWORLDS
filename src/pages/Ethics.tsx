import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RefList } from '../components/RefList';
import { EthicsCase } from '../components/interactives/EthicsCase';
import { ethicsCases } from '../data/ethicsCases';

export default function Ethics() {
  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Case clinic" title="Research ethics">
        Seven decisions investigators and review boards actually face. Choose, then compare your answer with the Declaration of Helsinki (2024), the Common Rule, ICH E6(R3) and the evidence. Principles are taught in <Link to="/learn/ethics" className="text-primary underline underline-offset-2">Module 11</Link>.
      </PageHeader>
      <div className="space-y-4">
        {ethicsCases.map((c) => (
          <EthicsCase key={c.id} c={c} />
        ))}
      </div>
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="mb-3 font-semibold">Governing documents</h2>
        <RefList ids={['helsinki2024', 'belmont1979', 'cioms2016', 'ich2025', 'commonrule2018', 'icmje', 'weijer2012']} />
      </section>
    </div>
  );
}
