import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Clock,
  ShieldCheck,
  X,
  Share2,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { HEALTH_RESOURCES, RESOURCE_CATEGORIES } from '../data/resources';
import { HealthResource } from '../types';
import { getSavedBookmarks, toggleBookmark } from '../services/api';

interface ResourcesPageProps {
  selectedResourceId?: string | null;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ selectedResourceId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getSavedBookmarks());
  const [activeModalResource, setActiveModalResource] = useState<HealthResource | null>(() => {
    if (selectedResourceId) {
      return HEALTH_RESOURCES.find((r) => r.id === selectedResourceId) || null;
    }
    return null;
  });

  const filteredResources = useMemo(() => {
    return HEALTH_RESOURCES.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || res.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleBookmark(id);
    setBookmarkedIds(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Health Library</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Evidence-Based Health Resources</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Curated clinical guides, preventative guidelines, and wellness education reviewed by physicians and referenced against guidelines from the CDC, WHO, and American Heart Association.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by condition, topic, or keyword (e.g. hypertension, pediatric fever, sleep, anti-inflammatory)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isSaved = bookmarkedIds.includes(res.id);
            return (
              <article
                key={res.id}
                onClick={() => setActiveModalResource(res)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <img
                      src={res.imageUrl}
                      alt={res.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-teal-800 shadow-xs">
                      {res.category}
                    </div>
                    <button
                      onClick={(e) => handleToggleBookmark(res.id, e)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
                        isSaved
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'bg-white/90 text-slate-600 hover:text-teal-700'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Article to Dashboard'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{res.readTime}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{res.publishedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                      {res.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {res.summary}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">Reviewed by {res.medicallyReviewedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-teal-700 font-semibold group-hover:underline flex items-center gap-1">
                      <span>Read Clinical Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-slate-400">{res.sourceCitations.length} Citations</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No resources found matching your query</h3>
          <p className="text-xs text-slate-500">Try searching for other topics or reset category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Full Article Reader Modal */}
      {activeModalResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-teal-700 uppercase tracking-wide">
                    {activeModalResource.category}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">{activeModalResource.readTime}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">{activeModalResource.publishedDate}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {activeModalResource.title}
                </h2>
                <p className="text-xs text-teal-800 font-medium flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Medically Reviewed by {activeModalResource.medicallyReviewedBy}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleBookmark(activeModalResource.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    bookmarkedIds.includes(activeModalResource.id)
                      ? 'bg-teal-50 border-teal-300 text-teal-700'
                      : 'border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                  title="Bookmark Article"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Print Article"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveModalResource(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
              {/* Executive Summary */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-teal-950 font-medium">
                <strong className="block text-xs uppercase tracking-wide text-teal-800 mb-1">
                  Executive Clinical Summary
                </strong>
                {activeModalResource.summary}
              </div>

              {/* Key Takeaways Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Key Takeaways
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {activeModalResource.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="leading-normal">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structured Sections */}
              <div className="space-y-5">
                {activeModalResource.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900">{sec.heading}</h3>
                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Source & Citations Section */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <ExternalLink className="w-4 h-4 text-teal-600" />
                  <span>Peer-Reviewed Clinical Sources & References</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-500">
                  {activeModalResource.sourceCitations.map((cite, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold">[{idx + 1}]</span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medical Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Medical Notice:</strong> This article is published for educational and informational purposes only. It should not be used to self-diagnose or substitute for individualized consultation with a qualified medical specialist.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Published in MediCare Health Intelligence</span>
              <button
                onClick={() => setActiveModalResource(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
