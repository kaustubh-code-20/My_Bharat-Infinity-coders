import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Database,
  Server,
  FileCode,
  FolderTree,
  Terminal,
} from 'lucide-react';
import {
  SUPABASE_SQL_SCHEMA,
  ENV_LOCAL_TEMPLATE,
  NEXTJS_API_ROUTE_CODE,
  FOLDER_STRUCTURE_TREE,
} from '../lib/supabaseSchema.ts';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'api' | 'env' | 'tree'>(
    'sql'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Hackathon Code & Supabase SQL Export
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-use Next.js 14 App Router files and PostgreSQL schema with RLS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sql'
                ? 'border-orange-500 text-orange-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase SQL (RLS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-orange-500 text-orange-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>app/api/scan/route.ts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('env')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'env'
                ? 'border-orange-500 text-orange-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>.env.local Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tree')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tree'
                ? 'border-orange-500 text-orange-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Project Folder Tree</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 relative font-mono text-xs leading-relaxed bg-slate-950 text-slate-300">
          {activeTab === 'sql' && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-slate-400">schema.sql (PostgreSQL + Row Level Security)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(SUPABASE_SQL_SCHEMA, 'sql')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
                >
                  {copiedKey === 'sql' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre font-mono text-slate-300">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-slate-400">app/api/scan/route.ts (Next.js 14 App Router)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(NEXTJS_API_ROUTE_CODE, 'api')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
                >
                  {copiedKey === 'api' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre font-mono text-slate-300">
                {NEXTJS_API_ROUTE_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-slate-400">.env.local.example</span>
                <button
                  type="button"
                  onClick={() => handleCopy(ENV_LOCAL_TEMPLATE, 'env')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
                >
                  {copiedKey === 'env' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre font-mono text-slate-300">
                {ENV_LOCAL_TEMPLATE}
              </pre>
            </div>
          )}

          {activeTab === 'tree' && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-slate-400">Next.js 14 Directory Tree</span>
                <button
                  type="button"
                  onClick={() => handleCopy(FOLDER_STRUCTURE_TREE, 'tree')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
                >
                  {copiedKey === 'tree' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Tree</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre font-mono text-slate-300">
                {FOLDER_STRUCTURE_TREE}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
