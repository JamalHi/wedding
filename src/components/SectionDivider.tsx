import { HeartRose } from './Rose';

/** فاصل أنيق بين الأقسام */
export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center pt-10 pb-4 md:pt-16 md:pb-6 px-4 sm:px-6">
      <div
        className="flex-1 h-px max-w-xs"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(242,196,206,0.25), transparent)' }}
      />
      <div className="mx-6 flex items-center gap-3">
        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(242,196,206,0.4)' }} />
        <HeartRose size={14} />
        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(242,196,206,0.4)' }} />
      </div>
      <div
        className="flex-1 h-px max-w-xs"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(242,196,206,0.25), transparent)' }}
      />
    </div>
  );
}
