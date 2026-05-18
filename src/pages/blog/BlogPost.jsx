import { Link, useParams } from 'react-router-dom';
import { getPost, POSTS } from './blogData.js';

const CAT_COLORS = {
  'نصائح': 'bg-brand-pink-softer text-brand-pink',
  'وصفات': 'bg-[#faf5e4] text-brand-gold',
  'أخبار': 'bg-brand-blue-soft text-[#4a7fa0]',
  'إلهام': 'bg-[#efe3f0] text-brand-ink-soft',
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="akwab-container py-24 text-center">
        <h2 className="text-3xl mb-4">المقال غير موجود</h2>
        <Link to="/blog" className="btn btn-primary">العودة للمدونة</Link>
      </div>
    );
  }

  const related = POSTS.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);

  return (
    <section className="py-12">
      <div className="akwab-container max-w-3xl">

        {/* Breadcrumb */}
        <nav className="text-sm text-brand-ink-soft mb-8 flex gap-2 flex-wrap">
          <Link to="/" className="hover:text-brand-pink">الرئيسية</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-brand-pink">المدونة</Link>
          <span>/</span>
          <span className="text-brand-ink truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${CAT_COLORS[post.category] || 'bg-brand-cream text-brand-ink-soft'}`}>
            {post.category}
          </span>
          <h1 className="text-[clamp(28px,4vw,44px)] leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-brand-ink-soft">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {post.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Featured image */}
        <div className={`w-full aspect-[16/7] rounded-brand overflow-hidden p-bg-${post.bg} flex items-center justify-center text-9xl opacity-20 mb-10`}>
          ☕
        </div>

        {/* Content */}
        <article className="space-y-5 mb-12">
          {post.content.map((para, i) => (
            <p key={i} className={`leading-[1.9] text-brand-ink-soft ${i === 0 ? 'text-[18px] text-brand-ink font-medium' : 'text-[16px]'}`}>
              {para}
            </p>
          ))}
        </article>

        {/* Divider */}
        <div className="flex items-center gap-3 text-brand-gold text-xs mb-10">
          <span className="flex-1 h-px bg-brand-gold opacity-30" />✿
          <span className="flex-1 h-px bg-brand-gold opacity-30" />
        </div>

        {/* Share */}
        <div className="flex items-center justify-between mb-14 flex-wrap gap-4">
          <span className="text-sm text-brand-ink-soft">أعجبكِ المقال؟ شاركيه 🌸</span>
          <div className="flex gap-2">
            {[
              { label: 'واتساب', bg: '#25D366', text: 'white' },
              { label: 'فيسبوك', bg: '#1877F2', text: 'white' },
              { label: 'تويتر', bg: '#1DA1F2', text: 'white' },
            ].map(s => (
              <button
                key={s.label}
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: s.bg, color: s.text }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h3 className="text-xl mb-5 font-amiri">مقالات ذات صلة</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group bg-white rounded-brand p-4 shadow-brand-sm hover:shadow-brand-md transition-all"
                >
                  <div className={`aspect-[3/2] rounded-brand-sm p-bg-${p.bg} flex items-center justify-center text-4xl opacity-20 mb-3`}>☕</div>
                  <span className="text-xs text-brand-pink font-semibold">{p.category}</span>
                  <h4 className="text-sm mt-1 leading-snug group-hover:text-brand-pink transition-colors">{p.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link to="/blog" className="btn btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="m9 18 6-6-6-6" />
            </svg>
            كل المقالات
          </Link>
        </div>

      </div>
    </section>
  );
}
