import React, { useState, useCallback } from 'react';
import { getPdfDetails } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { UploadCloudIcon, FileIcon, CheckCircleIcon } from './common/Icons';

const COST_PER_PAGE = 1.5;

interface PdfDetails {
  file: File;
  base64: string;
  pageCount: number;
  summary: string;
  cost: number;
}

export const StudentView: React.FC = () => {
  const { addJob, jobs, currentUser } = useAppContext();
  const [pdfDetails, setPdfDetails] = useState<PdfDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const resetState = () => {
    setPdfDetails(null);
    setIsLoading(false);
    setError(null);
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      resetState();
      setIsLoading(true);
      setError(null);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          const details = await getPdfDetails(base64String);
          setPdfDetails({
            file,
            base64: base64String,
            ...details,
            cost: details.pageCount * COST_PER_PAGE,
          });
          setIsLoading(false);
        };
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
        setIsLoading(false);
      }
    } else {
        setError('Please select a valid PDF file.');
    }
  }, []);

  const handlePayment = async () => {
    if (!pdfDetails) return;
    setIsPaying(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    addJob({
      fileName: pdfDetails.file.name,
      fileData: pdfDetails.base64,
      pageCount: pdfDetails.pageCount,
      summary: pdfDetails.summary,
      cost: pdfDetails.cost,
    });
    setIsPaying(false);
    resetState();
  };

  const myJobs = jobs.filter(job => job.studentId === currentUser).sort((a,b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-8">
      <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-textPrimary">New Print Job</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
            <label htmlFor="pdf-upload" className="mt-4 inline-block bg-primary text-onPrimary font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-primary-dark transition-colors">
                Select PDF
            </label>
            <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} disabled={isLoading} />
            <p className="mt-2 text-sm text-textSecondary">Upload a document to get a price quote.</p>
        </div>

        {isLoading && (
            <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-textSecondary">Analyzing your document...</p>
            </div>
        )}

        {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}

        {pdfDetails && !isLoading && (
          <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-4 mb-4">
              <FileIcon className="w-10 h-10 text-primary" />
              <div>
                <h3 className="text-lg font-bold text-textPrimary">{pdfDetails.file.name}</h3>
                <p className="text-sm text-textSecondary">{pdfDetails.pageCount} pages</p>
              </div>
            </div>
            <p className="text-textSecondary italic mb-6">"{pdfDetails.summary}"</p>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-surface p-4 rounded-md shadow-inner">
                <div>
                    <p className="text-sm font-medium text-textSecondary">Total Cost</p>
                    <p className="text-3xl font-bold text-primary">₹{pdfDetails.cost.toFixed(2)}</p>
                </div>
                <button 
                    onClick={handlePayment} 
                    disabled={isPaying}
                    className="mt-4 sm:mt-0 w-full sm:w-auto bg-secondary hover:bg-green-600 text-onSecondary font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPaying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                    ) : 'Pay & Add to Queue'}
                </button>
            </div>
          </div>
        )}
      </div>

      {myJobs.length > 0 && (
          <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
             <h2 className="text-2xl font-semibold mb-4 text-textPrimary">My Print History</h2>
             <ul className="space-y-3">
                 {myJobs.map(job => (
                     <li key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
                         <div className="flex items-center gap-3">
                            <FileIcon className="w-6 h-6 text-textSecondary"/>
                            <div>
                                <p className="font-semibold text-textPrimary">{job.fileName}</p>
                                <p className="text-sm text-textSecondary">{job.pageCount} pages - ₹{job.cost.toFixed(2)}</p>
                                {job.status === 'completed' && job.tokenNumber && (
                                    <p className="text-sm text-primary font-bold mt-1">Pickup Token: {job.tokenNumber}</p>
                                )}
                            </div>
                         </div>
                         <div className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             {job.status === 'completed' ? <CheckCircleIcon className="w-4 h-4"/> : <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>}
                             <span className="capitalize">{job.status}</span>
                         </div>
                     </li>
                 ))}
             </ul>
          </div>
      )}
    </div>
  );
};