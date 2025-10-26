
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PrintJob } from '../types';
import { EyeIcon, CheckCircleIcon, PrinterIcon } from './common/Icons';

const PrintTicket: React.FC<{ job: PrintJob, onComplete: (id: string) => void, onView: (data: string) => void }> = ({ job, onComplete, onView }) => {
  return (
    <div className="bg-surface p-5 rounded-lg shadow-md border border-gray-200 transition-all hover:shadow-lg hover:border-primary/50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-textPrimary break-all">{job.fileName}</h3>
          <p className="text-sm text-textSecondary">{job.pageCount} pages</p>
        </div>
        <p className="text-lg font-bold text-primary">₹{job.cost.toFixed(2)}</p>
      </div>
      <p className="text-sm text-textSecondary mt-3 italic">"{job.summary}"</p>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => onView(job.fileData)}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-textPrimary font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          <EyeIcon className="w-5 h-5" />
          View PDF
        </button>
        <button
          onClick={() => onComplete(job.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary text-onSecondary font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Mark as Completed
        </button>
      </div>
    </div>
  );
};

export const PrinterView: React.FC = () => {
  const { jobs, completeJob } = useAppContext();
  const pendingJobs = jobs.filter(job => job.status === 'pending').sort((a,b) => a.createdAt - b.createdAt);
  const completedJobs = jobs.filter(job => job.status === 'completed').sort((a,b) => b.createdAt - a.createdAt);

  const viewPdf = (base64Data: string) => {
    const pdfWindow = window.open("");
    if (pdfWindow) {
      pdfWindow.document.write(`<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64Data}'></iframe>`);
      pdfWindow.document.title = "PDF Preview";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-textPrimary">Pending Print Queue ({pendingJobs.length})</h2>
        {pendingJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingJobs.map(job => (
              <PrintTicket key={job.id} job={job} onComplete={completeJob} onView={viewPdf} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-lg shadow-sm border border-gray-200">
            <PrinterIcon className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-textSecondary">The print queue is empty.</p>
            <p className="text-sm text-gray-500">New jobs from students will appear here.</p>
          </div>
        )}
      </div>

      {completedJobs.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-textPrimary">Completed Jobs ({completedJobs.length})</h2>
          <div className="bg-surface p-4 rounded-lg shadow-sm border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {completedJobs.slice(0,5).map(job => ( // Show last 5 completed jobs
                <li key={job.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-textPrimary">{job.fileName}</p>
                    <p className="text-sm text-textSecondary">{job.pageCount} pages</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">Completed</span>
                  </div>
                </li>
              ))}
            </ul>
            {completedJobs.length > 5 && <p className="text-center text-sm text-textSecondary mt-3">... and {completedJobs.length - 5} more.</p>}
          </div>
        </div>
      )}
    </div>
  );
};