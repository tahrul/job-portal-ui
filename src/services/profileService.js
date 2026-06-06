import { delay } from '../utils/delay';

const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('jobPortalUser') || 'null');
  const id = user?.userId || user?.id;
  if (!id) throw new Error('No authenticated user');
  return id;
};

const getStorageKey = () => `userProfile_${getCurrentUserId()}`;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_RESUME_TYPES = ['application/pdf'];
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Get the current user's profile
 */
export const getProfile = async () => {
  await delay();
  const data = localStorage.getItem(getStorageKey());
  return data ? JSON.parse(data) : null;
};

/**
 * Create or update user profile
 */
export const updateProfile = async (profileData, profilePicture, resume) => {
  await delay();

  if (profilePicture) {
    if (!ALLOWED_IMAGE_TYPES.includes(profilePicture.type)) {
      throw new Error('Profile picture must be JPEG, PNG, or WebP');
    }
    if (profilePicture.size > MAX_IMAGE_SIZE) {
      throw new Error('Profile picture must be under 2 MB');
    }
  }

  if (resume) {
    if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
      throw new Error('Resume must be a PDF file');
    }
    if (resume.size > MAX_RESUME_SIZE) {
      throw new Error('Resume must be under 5 MB');
    }
  }

  const existing = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');

  const updated = {
    ...existing,
    ...profileData,
    id: existing.id || Date.now(),
    updatedAt: new Date().toISOString(),
  };

  if (profilePicture) {
    const dataUrl = await fileToDataUrl(profilePicture);
    updated.profilePictureData = dataUrl;
    updated.profilePictureName = profilePicture.name;
  }

  if (resume) {
    const dataUrl = await fileToDataUrl(resume);
    updated.resumeData = dataUrl;
    updated.resumeName = resume.name;
  }

  localStorage.setItem(getStorageKey(), JSON.stringify(updated));
  return updated;
};

/**
 * Get profile picture URL
 */
export const getProfilePictureUrl = async () => {
  await delay();
  const profile = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
  return profile.profilePictureData || null;
};

/**
 * Download resume
 */
export const downloadResume = async () => {
  await delay();
  const profile = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
  if (profile.resumeData) {
    const link = document.createElement('a');
    link.href = profile.resumeData;
    link.download = profile.resumeName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Get resume as URL for preview
 */
export const getResumeUrl = async () => {
  await delay();
  const profile = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
  return profile.resumeData || null;
};

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
