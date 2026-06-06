import { delay } from '../utils/delay';
import { jobs } from '../data/mockData';

const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('jobPortalUser') || 'null');
  const id = user?.userId || user?.id;
  if (!id) throw new Error('No authenticated user');
  return id;
};

const getStorageKey = () => `jobApplications_${getCurrentUserId()}`;
const getApplications = () => JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
const saveApplications = (apps) => localStorage.setItem(getStorageKey(), JSON.stringify(apps));

/**
 * Apply for a job
 */
export const applyForJob = async (jobId, coverLetter = '') => {
  await delay();
  const apps = getApplications();
  const newApp = {
    id: Date.now(),
    jobId,
    coverLetter,
    status: 'APPLIED',
    appliedAt: new Date().toISOString(),
  };
  apps.push(newApp);
  saveApplications(apps);
  return newApp;
};

/**
 * Withdraw an application
 */
export const withdrawApplication = async (jobId) => {
  await delay();
  const apps = getApplications().filter(a => a.jobId !== jobId);
  saveApplications(apps);
};

/**
 * Get all applications for the current user
 */
export const getMyApplications = async () => {
  await delay();
  const apps = getApplications();
  const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
  const allJobs = [...jobs, ...globalPostedJobs];
  return apps.map(app => {
    const job = allJobs.find(j => j.id === app.jobId) || {};
    return {
      id: app.id,
      appliedAt: app.appliedAt,
      status: app.status,
      coverLetter: app.coverLetter,
      job,
    };
  });
};

/**
 * Get all applied job IDs for the current user
 */
export const getAppliedJobIds = async () => {
  await delay();
  return getApplications().map(a => a.jobId);
};

/**
 * Check if user has applied for a job
 */
export const hasApplied = async (jobId) => {
  await delay();
  return getApplications().some(a => a.jobId === jobId);
};

/**
 * Get all applications for a specific job (Employer)
 * Only returns applications for jobs owned by the requesting employer.
 */
export const getApplicationsByJob = async (jobId) => {
  await delay();
  const employerId = getCurrentUserId();

  // Verify the employer owns this job
  const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
  const employerJobs = JSON.parse(localStorage.getItem(`postedJobs_${employerId}`) || '[]');
  const allPostedJobs = [...globalPostedJobs, ...employerJobs];
  const job = allPostedJobs.find(j => j.id === parseInt(jobId));

  if (!job || String(job.postedBy) !== String(employerId)) {
    return [];
  }

  const allApps = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('jobApplications_')) {
      const apps = JSON.parse(localStorage.getItem(key) || '[]');
      const userId = key.replace('jobApplications_', '');
      apps.filter(a => a.jobId === parseInt(jobId)).forEach(app => {
        allApps.push({
          ...app,
          userId,
          applicantName: `Applicant ${userId}`,
          applicantEmail: `user${userId}@example.com`,
        });
      });
    }
  }
  return allApps;
};

/**
 * Get all applications for the employer's company
 */
export const getCompanyApplications = async () => {
  await delay();
  return [];
};

/**
 * Update application status (Employer)
 * Only allows updates for applications belonging to jobs owned by the requesting employer.
 */
export const updateApplicationStatus = async (applicationId, status, notes = '') => {
  await delay();
  const employerId = getCurrentUserId();

  const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
  const employerJobs = JSON.parse(localStorage.getItem(`postedJobs_${employerId}`) || '[]');
  const allPostedJobs = [...globalPostedJobs, ...employerJobs];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('jobApplications_')) {
      const apps = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = apps.findIndex(a => a.id === applicationId);
      if (idx !== -1) {
        const jobEntry = allPostedJobs.find(j => j.id === apps[idx].jobId);
        if (!jobEntry || String(jobEntry.postedBy) !== String(employerId)) {
          throw new Error('Not authorized to update this application');
        }
        apps[idx].status = status;
        apps[idx].notes = notes;
        localStorage.setItem(key, JSON.stringify(apps));
        return apps[idx];
      }
    }
  }
  throw new Error('Application not found');
};
