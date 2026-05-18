import { useState } from 'react';
import { Link } from 'react-router-dom';
import { POSTS, CATEGORIES } from './blogData.js';
import { SectionHead } from '../../components/SectionHead.jsx';

const CAT_COLORS = {
  'نصائح': 'bg-brand-pink-softer text-brand-pink',
  'وصفات': 'bg-[#faf5e4] text-brand-gold',
  'أخبار': 'bg-brand-blue-soft text-[#4a7fa0]',
  'إلهام': 'bg-[#efe3f0] text-brand-ink-soft',
};

export default function Blog() {
  const [activeCat, setActiveCat] = useState('كل المقالات');

  const filtered = activeCat === 'كل المقالات'
    ? POSTS
    : POSTS.filter(p => p.category === activeCat);

  const [featured, ...rest] = filtered;

  return (
    <>
      {/* Header */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fce8f0 0%,#fef9e7 60%,#d8e8f3 100%)' }}
      >
        <span className="absolute top-8 right-16 text-4xl opacity-20 select-none">🌸</span>
        <span className="absolute bottom-8 left-20 text-3xl opacity-20 select-none">✿</span>
        <div className="akwab-container relative z-10">
          <p className="text-xs uppercase tracking-[0.1em] text-brand-pink font-semibold mb-3 font-cairo">المدونة</p>
          <h1 className="text-[clamp(32px,4.5vw,56px)] mb-4">أفكار، وصفات، وإلهام</h1>
          <p className="text-brand-ink-soft text-[17px] max-w-xl mx-auto">
            كل ما يتعلق بعالم الخزف والقهوة والهدايا — من ورشتنا إلى مطبخك.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="akwab-container max-w-5xl">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat
                    ? 'bg-brand-pink text-white shadow-brand-md'
                    : 'bg-white text-brand-ink border border-brand-line hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink-softer'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-brand-ink-soft py-16">لا توجد مقالات في هذه الفئة بعد.</p>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  to={`/blog/${featured.slug}`}
                  className="reveal group grid md:grid-cols-[1fr_1fr] gap-0 bg-white rounded-brand shadow-brand-sm hover:shadow-brand-md transition-all overflow-hidden mb-8 block"
                >
                  <div className={`aspect-[4/3] md:aspect-auto p-bg-${featured.bg} flex items-center justify-center text-8xl opacity-30`}>
                    ☕
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit ${CAT_COLORS[featured.category] || 'bg-brand-cream text-brand-ink-soft'}`}>
                      {featured.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl mb-3 group-hover:text-brand-pink transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-brand-ink-soft text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-brand-ink-soft">
                      <span>{featured.date}</span>
                      <span>·</span>
                      <span>⏱ {featured.readTime}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest grid */}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
}

function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="reveal group bg-white rounded-brand shadow-brand-sm hover:shadow-brand-md transition-all overflow-hidden flex flex-col"
    >
      <div className={`aspect-[16/9] p-bg-${post.bg} flex items-center justify-center text-6xl opacity-25`}>
        ☕
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 w-fit ${CAT_COLORS[post.category] || 'bg-brand-cream text-brand-ink-soft'}`}>
          {post.category}
        </span>
        <h3 className="text-lg leading-snug mb-2 group-hover:text-brand-pink transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-sm text-brand-ink-soft line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-brand-ink-soft mt-auto">
          <span>{post.date}</span>
          <span>·</span>
          <span>⏱ {post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
