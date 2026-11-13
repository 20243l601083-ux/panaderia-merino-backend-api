import { environment } from '../../environments/environment';

export function getApiBaseUrl(): string {
  if (environment.apiUrl) {
    return environment.apiUrl;
  }

  const protocol = window.location.protocol || 'http:';
  const hostname = window.location.hostname || 'localhost';
  return `${protocol}//${hostname}:3000/api`;
}
