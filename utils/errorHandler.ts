import { Alert, Platform } from 'react-native';

interface ErrorWithMessage {
  message: string;
  status?: number;
  response?: {
    data?: any;
    status?: number;
  };
}

export const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

export const handleApiError = (error: unknown, customMessage?: string) => {
  console.error('API Error:', error);
  
  let errorMessage = customMessage || 'An error occurred';
  
  if (isErrorWithMessage(error)) {
    const status = error.status || error.response?.status;
    
    if (status === 401) {
      errorMessage = 'Your session has expired. Please log in again.';
      // You can add navigation to login here if needed
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (status === 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }
  }
  
  // Show error to user
  if (Platform.OS === 'web') {
    alert(errorMessage);
  } else {
    Alert.alert('Error', errorMessage);
  }
  
  return errorMessage;
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  customMessage?: string
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    handleApiError(error, customMessage);
    return undefined;
  }
};

export const logError = (error: unknown, context: string = '') => {
  const errorMessage = getErrorMessage(error);
  console.error(`[${context}]`, errorMessage, error);
  // Here you can add your error logging service (e.g., Sentry, Firebase Crashlytics)
};
