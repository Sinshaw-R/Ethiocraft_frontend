"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Flag,
  ImageUp,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from 'lucide-react';

type TabKey = 'Details' | 'Verification' | 'Reviews' | 'Activity';

type ReviewItem = {
  id: string;
  author: string;
  rating: number;
  text: string;
  flagged?: boolean;
  hidden?: boolean;
};

const tabs: TabKey[] = ['Details', 'Verification', 'Reviews', 'Activity'];

export default function App() {
  const { id } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('Details');
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [details, setDetails] = useState<any>({});
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const base = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '') || 'http://localhost:4000/api/v1';
        const token = localStorage.getItem('token');
        const res = await fetch(`${base}/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const json = await res.json();
        const data = json.data;
        setProductData(data);
        
        // Sync internal states with fetched data
        setIsVisible(data.status === 'PUBLISHED');
        setDetails({
          material: data.materials?.join(', ') || 'Not found',
          dimensions: data.dimensions ? `${data.dimensions.widthCm || ''}x${data.dimensions.heightCm || ''} cm` : 'Not found',
          region: data.artisan?.artisanProfile?.region || 'Not found',
          craftMethod: data.tags?.join(', ') || 'Not found',
          stock: data.stock?.toString() || '0',
          price: data.price?.toString() || '0',
        });
        setReviews((data.reviews || []).map((review: any) => ({
          id: review.id,
          author: `${review.customer?.firstName || ''} ${review.customer?.lastName || ''}`.trim() || 'Unknown',
          rating: review.rating,
          text: review.comment || '',
        })));
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const gallery = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '') || 'http://localhost:4000/api/v1';
    const apiImages = (productData?.media || []).map((m: any) => {
      if (m.url.startsWith('http') || m.url.startsWith('data:')) return m.url;
      return `${base}${m.url}`;
    });
    return apiImages;
  }, [productData]);

  const longDescription = productData?.description || 'Not found';

  const riskAlerts = Array.isArray(productData?.riskAlerts) ? productData.riskAlerts : [];

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const shortDescription = useMemo(() => longDescription.slice(0, 230), [longDescription]);

  const handleHideReview = (id: string) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, hidden: !review.hidden } : review)));
    showToast('Review visibility updated');
  };

  const handleRemoveReview = (id: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
    showToast('Review removed');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] text-[#1C1C1C]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C6A75E] border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Fetching Product Details...</p>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAF9]">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Failed to load product</h2>
        <p className="mt-2 text-sm text-[#6f655d]">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#3E2723] px-6 py-2 text-sm text-white">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-4 py-6 text-[#1C1C1C] md:px-8 md:py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mx-auto max-w-[1360px]">
        <header className="mb-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f2ece2] px-3 py-1 text-xs text-[#655745]">{productData?.category || 'Not found'}</span>
                <span className={`rounded-full border px-3 py-1 text-xs ${isVisible ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-neutral-50 text-neutral-600'}`}>
                  {isVisible ? 'Live' : 'Hidden'}
                </span>
              </div>
              <h1
                className="text-3xl uppercase tracking-[0.04em] md:text-4xl"
                style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}
              >
                {productData?.title || 'Not found'}
              </h1>
              <div className="mt-3 flex flex-wrap gap-5 text-xs text-[#7a7068]">
                <span>Product ID: {productData?.id || 'Not found'}</span>
                <span>Published: {productData?.publishedAt ? new Date(productData.publishedAt).toLocaleDateString() : 'Not found'}</span>
                <span>Last updated: {productData?.updatedAt ? new Date(productData.updatedAt).toLocaleDateString() : 'Not found'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
              <button
                onClick={() => showToast('Edit mode opened')}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setIsFeatured((prev) => !prev);
                  showToast(isFeatured ? 'Removed from featured' : 'Marked as featured');
                }}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                  isFeatured ? 'border-[#e7d8bb] bg-[#faf5ea] text-[#6e5a3d]' : 'border-neutral-200 bg-white'
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${isFeatured ? 'fill-[#C6A75E] text-[#C6A75E]' : ''}`} />
                {isFeatured ? 'Featured' : 'Feature'}
              </button>
              <button
                onClick={() => {
                  setIsVisible((prev) => !prev);
                  showToast(!isVisible ? 'Product is now live' : 'Product hidden from marketplace');
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {isVisible ? 'Live' : 'Hidden'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="space-y-6 xl:col-span-8">
            <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                  Product Gallery
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#766a5d]">Image quality: Good</span>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-[#5f554b]">
                    <ImageUp className="h-3.5 w-3.5" /> Update Media
                  </button>
                  <button
                    onClick={() => setShow3D(true)}
                    className="rounded-lg border border-[#3E2723] px-3 py-1.5 text-xs text-[#3E2723] transition hover:bg-[#3E2723] hover:text-[#FAFAF9]"
                  >
                    View in 3D
                  </button>
                </div>
              </div>

              <div className="group overflow-hidden rounded-2xl bg-[#f3ede2]">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[selectedImage]}
                    alt="Product media"
                    className="h-[460px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-[460px] w-full items-center justify-center text-sm text-[#766a5d]">
                    No product images uploaded yet.
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border transition ${
                      index === selectedImage ? 'border-[#C6A75E]' : 'border-neutral-200 hover:border-[#d5c5a6]'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
              <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                Product Story
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-[#5f5750]">
                {showFullDescription ? longDescription : `${shortDescription}${longDescription.length > 230 ? '...' : ''}`}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#5f5750]">
                Cultural meaning: {productData?.culturalMetadata?.story || 'Not provided'}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
                >
                  {showFullDescription ? 'Show less' : 'Read full description'}
                </button>
                <button
                  onClick={() => showToast('AI summarize is available in a future update')}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-[#6f655c]"
                >
                  Summarize
                </button>
              </div>
            </article>

            <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md">
              <div className="mb-4 flex flex-wrap gap-5 border-b border-neutral-200 pb-3" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-2 text-sm transition ${
                      activeTab === tab ? 'text-[#3E2723]' : 'text-[#7a6f65] hover:text-[#3E2723]'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#C6A75E]" />}
                  </button>
                ))}
              </div>

              {activeTab === 'Details' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(details).map(([key, value]) => (
                    <label key={key} className="text-sm">
                      <span className="mb-1 block text-xs uppercase tracking-[0.08em] text-[#83766c]">
                        {key === 'region' ? 'Region of Origin' : key}
                      </span>
                      <input
                        value={value || ''}
                        onChange={(event) => setDetails((prev) => ({ ...prev, [key]: event.target.value }))}
                        className={`w-full rounded-xl border bg-[#fffefc] px-3 py-2 outline-none transition focus:border-[#C6A75E] ${
                          key === 'region' ? 'border-[#e6d9bd] text-[#8f7238]' : 'border-neutral-200'
                        }`}
                      />
                    </label>
                  ))}
                </div>
              )}

              {activeTab === 'Verification' && (
                <div className="space-y-4 text-sm">
                  {[
                    { title: 'Digital submission', note: productData?.verification?.submittedAt ? `Submitted on ${new Date(productData.verification.submittedAt).toLocaleDateString()}` : 'Not submitted yet.' },
                    { title: 'Review', note: productData?.verification?.reviewedAt ? `Reviewed on ${new Date(productData.verification.reviewedAt).toLocaleDateString()}` : 'Not reviewed yet.' },
                    { title: 'Publication', note: productData?.verification?.publishedAt ? `Published on ${new Date(productData.verification.publishedAt).toLocaleDateString()}` : 'Not published yet.' },
                  ].map((step, index) => (
                    <div key={step.title} className="relative rounded-2xl border border-neutral-200 p-4">
                      {index < 2 && <span className="absolute left-[18px] top-[52px] h-8 w-px bg-neutral-200" />}
                      <div className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-xs text-[#6f6459]">{step.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-neutral-200 bg-[#faf8f4] p-3 text-xs text-[#6f6459]">
                    <p className="font-medium">Agent report</p>
                    <p className="mt-1">{productData?.verification?.verificationNotes || 'No verification notes available.'}</p>
                  </div>
                  <button
                    onClick={() => showToast('Re-verification request sent')}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-[#6f6459]"
                  >
                    Request re-verification
                  </button>
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-neutral-200 p-4 text-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.author}</p>
                          {review.flagged && (
                            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-700">Flagged</span>
                          )}
                          {review.hidden && (
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">Hidden</span>
                          )}
                        </div>
                        <p className="flex items-center gap-1 text-[#6b6156]">
                          <Star className="h-3.5 w-3.5 fill-[#C6A75E] text-[#C6A75E]" /> {review.rating}/5
                        </p>
                      </div>
                      <p className="text-[#5f5750]">{review.text}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleHideReview(review.id)}
                          className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-[#6f655c]"
                        >
                          {review.hidden ? 'Unhide' : 'Hide'}
                        </button>
                        <button
                          onClick={() => handleRemoveReview(review.id)}
                          className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Activity' && (
                <ol className="space-y-3 border-l border-neutral-200 pl-4 text-sm text-[#615851]">
                  {(productData?.activity?.length ? productData.activity : ['No activity available yet.']).map((event: string) => (
                    <li key={event} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#C6A75E]" />
                      {event}
                    </li>
                  ))}
                </ol>
              )}
            </article>
          </section>

          <aside className="space-y-6 xl:col-span-4">
            <div className="xl:sticky xl:top-6 xl:space-y-6">
              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Live Status
                </h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className={`rounded-full border px-2 py-1 text-xs ${isVisible ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-neutral-50 text-neutral-600'}`}>
                      {isVisible ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visibility</span>
                    <span className="text-xs text-[#6f655c]">{isVisible ? 'Public' : 'Hidden'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Feature status</span>
                    <span className="text-xs text-[#6f655c]">{isFeatured ? 'Featured' : 'Standard'}</span>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Artisan
                </h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efe7d7] text-sm font-semibold text-[#8a6f3a]">
                    {(productData?.artisan?.firstName?.[0] || '')}{(productData?.artisan?.lastName?.[0] || '')}
                  </div>
                  <div>
                    <p className="font-medium text-[#8a6f3a]">{`${productData?.artisan?.firstName || ''} ${productData?.artisan?.lastName || ''}`.trim() || 'Not found'}</p>
                    <p className="text-xs text-[#6f655c]">{productData?.artisan?.artisanProfile?.shopName || 'Not found'}</p>
                    <p className="text-xs text-[#6f655c]">{productData?.artisan?.artisanProfile?.city || 'Not found'}, {productData?.artisan?.artisanProfile?.region || 'Not found'}</p>
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Artisan
                </span>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <button className="rounded-lg border border-neutral-200 px-2 py-1.5">View profile</button>
                  <button className="rounded-lg border border-neutral-200 px-2 py-1.5">Message</button>
                  <button className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700">Suspend</button>
                </div>
              </article>

              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Pricing & Performance
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex justify-between"><span>Price</span><span className="font-medium">{productData?.currency || 'ETB'} {details.price}</span></p>
                  <p className="flex justify-between"><span>Stock</span><span>{details.stock}</span></p>
                  <p className="flex justify-between"><span>Sales</span><span>{productData?.analytics?.totalUnitsSold ?? 0}</span></p>
                  <p className="flex justify-between"><span>Revenue</span><span>{productData?.currency || 'ETB'} {(productData?.analytics?.totalRevenue ?? 0).toLocaleString()}</span></p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl border border-neutral-200 p-2">
                    <p className="text-[#7a7068]">Order Items</p>
                    <p className="mt-1 font-semibold">{productData?.analytics?.totalOrderItems ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 p-2">
                    <p className="text-[#7a7068]">Rating</p>
                    <p className="mt-1 font-semibold">{productData?.analytics?.averageRating ?? '—'}</p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 p-2">
                    <p className="text-[#7a7068]">Reviews</p>
                    <p className="mt-1 font-semibold">{productData?.analytics?.totalReviews ?? 0}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Admin Controls
                </h3>
                <div className="mt-4 space-y-2 text-sm" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                  <button onClick={() => showToast('Edit page opened')} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left">
                    Edit product
                  </button>
                  <button
                    onClick={() => {
                      setIsVisible((prev) => !prev);
                      showToast(isVisible ? 'Visibility set to hidden' : 'Visibility set to live');
                    }}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left"
                  >
                    Toggle visibility
                  </button>
                  <button
                    onClick={() => {
                      setIsFeatured((prev) => !prev);
                      showToast(isFeatured ? 'Removed from featured list' : 'Added to featured list');
                    }}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left"
                  >
                    Mark as featured
                  </button>
                  <button onClick={() => showToast('Product flagged for internal review')} className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-amber-800">
                    <span className="inline-flex items-center gap-2"><Flag className="h-3.5 w-3.5" /> Flag product</span>
                  </button>
                  <button onClick={() => showToast('Review request submitted')} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left">
                    Request review
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-700">
                    <span className="inline-flex items-center gap-2"><Trash2 className="h-3.5 w-3.5" /> Delete product</span>
                  </button>
                </div>
              </article>

              {riskAlerts.length > 0 && (
                <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                    Alerts
                  </h3>
                  <div className="mt-4 space-y-2">
                    {riskAlerts.map((alert: string, index: number) => (
                      <div key={`${alert}-${index}`} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </div>
          </aside>
        </div>
      </div>

      {show3D && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/45 px-4" onClick={() => setShow3D(false)}>
          <div
            className="w-full max-w-3xl rounded-3xl border border-neutral-200 bg-[#fffdf9] p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                3D Product View
              </h3>
              <button onClick={() => setShow3D(false)} className="text-[#6f655c]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex h-[420px] items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_20%_20%,#e6dac4_0%,#f7f3ea_45%,#f7f3ea_100%)]">
              <div className="rounded-2xl border border-[#ddceb7] bg-white/70 px-6 py-5 text-center">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 text-[#725f43]" />
                <p className="text-sm" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                  Interactive 3D model placeholder
                </p>
                <p className="mt-1 text-xs text-[#766a5d]">Drag to explore</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/45 px-4" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h4 className="text-lg font-semibold">Delete this live product?</h4>
            <p className="mt-2 text-sm text-[#6f655c]">This action removes the product from marketplace visibility and cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">Cancel</button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  showToast('Delete request submitted');
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-md">
          {toast}
        </div>
      )}
    </div>
  );
}