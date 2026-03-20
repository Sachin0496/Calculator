export function getClerkErrorMessage(error: any): string {
  if (!error) return 'Something went wrong. Please try again.';

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    const firstError = error.errors[0];
    return (
      firstError.longMessage ||
      firstError.message ||
      firstError.code ||
      'Something went wrong. Please try again.'
    );
  }

  if (typeof error === 'string') return error;
  if (typeof error?.message === 'string') return error.message;
  return 'Something went wrong. Please try again.';
}
